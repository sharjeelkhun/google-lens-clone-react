
// Define interface for the Web Speech API
export interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
        confidence: number;
      }
    }
  }
  resultIndex: number;
}

// Helper function to get speech recognition API
export const getSpeechRecognition = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return null;
  }
  
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;
};

// Start speech recognition with callback for result
export const startSpeechRecognition = (
  onResult: (text: string) => void,
  onListeningChange: (isListening: boolean) => void,
  options = { continuous: false, interimResults: true, language: 'en-US' }
) => {
  const recognition = getSpeechRecognition();
  
  if (!recognition) {
    console.error("Speech recognition not supported in this browser.");
    return false;
  }
  
  // Configure recognition
  recognition.lang = options.language;
  recognition.continuous = options.continuous;
  recognition.interimResults = options.interimResults;
  
  // Handle interim results for real-time feedback
  let finalTranscript = '';
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Send interim results for real-time updates
    if (interimTranscript) {
      onResult(finalTranscript + interimTranscript);
    }
    
    // If we have final results, use those
    if (finalTranscript) {
      onResult(finalTranscript);
      if (!options.continuous) {
        recognition.stop();
        onListeningChange(false);
      }
    }
  };
  
  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    onListeningChange(false);
  };
  
  recognition.onend = () => {
    // Only change listening state if we have a final result or there's an error
    // This prevents the microphone icon from flickering during brief pauses
    if (!options.continuous) {
      onListeningChange(false);
    }
  };
  
  recognition.start();
  onListeningChange(true);
  return true;
};

// Helper to check if the browser supports speech synthesis
export const getSpeechSynthesis = () => {
  return 'speechSynthesis' in window ? window.speechSynthesis : null;
};

// Speak text out loud
export const speakText = (text: string, options = { voice: null, rate: 1, pitch: 1 }) => {
  const synthesis = getSpeechSynthesis();
  
  if (!synthesis) {
    console.error("Speech synthesis not supported in this browser.");
    return false;
  }
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure utterance
  utterance.rate = options.rate;
  utterance.pitch = options.pitch;
  
  if (options.voice) {
    utterance.voice = options.voice;
  }
  
  // Speak
  synthesis.speak(utterance);
  return true;
};

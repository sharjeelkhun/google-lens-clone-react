
// Define interface for the Web Speech API
export interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      }
    }
  }
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
  onListeningChange: (isListening: boolean) => void
) => {
  const recognition = getSpeechRecognition();
  
  if (!recognition) {
    alert("Speech recognition not supported in this browser.");
    return false;
  }
  
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
    onListeningChange(false);
  };
  
  recognition.onerror = () => {
    onListeningChange(false);
  };
  
  recognition.onend = () => {
    onListeningChange(false);
  };
  
  recognition.start();
  onListeningChange(true);
  return true;
};

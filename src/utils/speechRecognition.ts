
// Simple wrapper for the Web Speech API
export const startSpeechRecognition = (
  onResultCallback: (text: string) => void,
  onListeningCallback: (isListening: boolean) => void,
  options: {
    continuous?: boolean,
    interimResults?: boolean,
    language?: string
  } = {}
) => {
  // Check browser support
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Speech recognition not supported in this browser');
    return false;
  }

  // Set default options
  const settings = {
    continuous: options.continuous ?? false,
    interimResults: options.interimResults ?? true,
    language: options.language ?? 'en-US'
  };

  // Initialize speech recognition
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  const recognition = new SpeechRecognition();

  // Configure
  recognition.continuous = settings.continuous;
  recognition.interimResults = settings.interimResults;
  recognition.lang = settings.language;

  // Event handlers
  recognition.onstart = () => {
    onListeningCallback(true);
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    // Handle results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Use final or interim results
    const resultText = finalTranscript || interimTranscript;
    if (resultText) {
      onResultCallback(resultText);
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error', event.error);
    onListeningCallback(false);
  };

  recognition.onend = () => {
    onListeningCallback(false);
  };

  // Start listening
  try {
    recognition.start();
    return true;
  } catch (error) {
    console.error('Failed to start speech recognition:', error);
    return false;
  }
};

// Type definitions to help TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

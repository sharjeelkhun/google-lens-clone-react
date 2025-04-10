
import { useEffect, useState, useRef } from "react";
import { Search, X, Camera, Mic, ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import SearchSuggestions from "@/components/SearchSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    searchTerm, 
    setSearchTerm, 
    isListening, 
    setIsListening,
    addToHistory, 
    performImageSearch,
    setSearchImage
  } = useSearch();
  const [focusedInput, setFocusedInput] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraCapturing, setCameraCapturing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if we should open the camera based on navigation state
    const stateOpenCamera = location.state?.openCamera;
    if (stateOpenCamera) {
      setOpenCamera(true);
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  }, [location.state]);

  useEffect(() => {
    if (inputRef.current && !openCamera) {
      inputRef.current.focus();
    }
  }, [openCamera]);

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add search term to history before navigating
      addToHistory(searchTerm, 'text');
      navigate("/results");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVoiceSearch = () => {
    const started = startSpeechRecognition(
      (text) => setSearchTerm(text),
      (listening) => setIsListening(listening)
    );
    
    if (!started) {
      console.error("Speech recognition failed to start");
      toast({
        title: "Speech Recognition Failed",
        description: "Your browser may not support this feature",
        variant: "destructive"
      });
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (videoRef.current) {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        console.log("Camera access granted, setting up video stream");
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, camera is now capturing");
          setCameraCapturing(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        console.log("Stopping track:", track.kind, track.label);
        track.stop()
      });
      videoRef.current.srcObject = null;
      setCameraCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && cameraCapturing) {
      console.log("Capturing image from video feed");
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          const imageDataUrl = canvas.toDataURL("image/jpeg");
          console.log("Image captured successfully, data URL length:", imageDataUrl.length);
          setSelectedImage(imageDataUrl);
          stopCamera();
        } catch (err) {
          console.error("Error capturing image:", err);
          toast({
            title: "Capture Error",
            description: "Failed to capture image",
            variant: "destructive"
          });
        }
      }
    } else {
      console.error("Cannot capture image: video or canvas not available or camera not capturing");
      toast({
        title: "Capture Error",
        description: "Camera is not ready yet",
        variant: "destructive"
      });
    }
  };

  const handleCameraToggle = () => {
    if (openCamera) {
      stopCamera();
      setOpenCamera(false);
      setSelectedImage(null);
    } else {
      setOpenCamera(true);
      setTimeout(() => startCamera(), 300);
    }
  };

  const handleSearchWithImage = async () => {
    if (selectedImage) {
      try {
        console.log("Processing image for search...");
        setIsProcessing(true);
        
        // Convert data URL to File object
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
        
        console.log("File created successfully, size:", file.size);
        
        // Save image preview to context
        setSearchImage({
          file,
          preview: selectedImage
        });
        
        // Use the performImageSearch function from context
        await performImageSearch(file);
        
        // Add to history after successful processing
        addToHistory("Image search", 'image', selectedImage);
        
        // Navigate to results page
        navigate("/results");
      } catch (error) {
        console.error("Error processing image search:", error);
        toast({
          title: "Image Search Failed",
          description: "Could not process the image search. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    } else {
      toast({
        title: "No Image Selected",
        description: "Please capture an image first",
        variant: "destructive"
      });
    }
  };

  const handleGoBack = () => {
    if (selectedImage) {
      setSelectedImage(null);
      startCamera();
    } else {
      stopCamera();
      setOpenCamera(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    addToHistory(suggestion, 'text');
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="main-content flex-1">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            {(openCamera || focusedInput) && (
              <button
                onClick={() => {
                  if (openCamera) {
                    handleGoBack();
                  } else {
                    navigate("/");
                  }
                }}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
            )}
            {!openCamera && (
              <div className="flex items-center">
                <span className="text-2xl font-medium text-google-blue">G</span>
                <span className="text-2xl font-medium text-google-red">o</span>
                <span className="text-2xl font-medium text-google-yellow">o</span>
                <span className="text-2xl font-medium text-google-blue">g</span>
                <span className="text-2xl font-medium text-google-green">l</span>
                <span className="text-2xl font-medium text-google-red">e</span>
              </div>
            )}
            {openCamera && (
              <div className="text-lg font-medium">
                {selectedImage ? "Search with this image" : "Google Lens"}
              </div>
            )}
          </div>

          {!openCamera && (
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              U
            </div>
          )}
        </div>

        {!openCamera && (
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="search-bar-container border border-gray-300 rounded-full px-4 py-2 flex items-center shadow-sm">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setTimeout(() => setFocusedInput(false), 200)} // Delay for click to register
                  placeholder="Search Google or type a URL"
                  className="flex-1 bg-transparent text-base outline-none"
                />
                <div className="flex items-center space-x-2">
                  {searchTerm && (
                    <button type="button" onClick={clearSearch}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <div className="h-5 border-l border-gray-300 mx-1"></div>
                  <button type="button" onClick={handleVoiceSearch}>
                    {isListening ? (
                      <div className="w-5 h-5 rounded-full bg-google-blue animate-pulse"></div>
                    ) : (
                      <Mic className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button type="button" onClick={handleCameraToggle}>
                    <Camera className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {!openCamera && focusedInput && (
          <div className="px-4">
            <SearchSuggestions 
              searchTerm={searchTerm} 
              onSelectSuggestion={handleSelectSuggestion} 
            />
          </div>
        )}

        <AnimatePresence>
          {openCamera && (
            <motion.div
              className="flex-1 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showFlash && (
                <div className="absolute inset-0 bg-white animate-flash z-20"></div>
              )}

              {selectedImage ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative">
                    <img
                      src={selectedImage}
                      alt="Captured"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex justify-between">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md"
                      onClick={handleGoBack}
                      disabled={isProcessing}
                    >
                      Retake
                    </button>
                    <button
                      className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isProcessing ? 'opacity-70' : ''}`}
                      onClick={handleSearchWithImage}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Search'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative bg-black">
                    {cameraError ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-center p-4">
                        <div>
                          <p className="text-red-500 mb-4">{cameraError}</p>
                          <button 
                            onClick={() => {
                              setCameraError(null);
                              startCamera();
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-5/6 h-5/6 border-2 border-white rounded-lg"></div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {cameraCapturing && !cameraError && (
                    <div className="pb-8 pt-4 flex justify-center">
                      <button
                        onClick={captureImage}
                        className="w-16 h-16 rounded-full border-4 border-white bg-white p-1 shadow-lg"
                      >
                        <div className="bg-blue-500 w-full h-full rounded-full"></div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!openCamera && !focusedInput && (
          <div className="mt-6 px-4">
            <h3 className="text-sm text-gray-700 mb-2 font-medium">Recent searches</h3>
            {["Google Search", "React hooks", "Tailwind CSS"].map((item, i) => (
              <div
                key={i}
                className="flex items-center py-3 border-b border-gray-100"
                onClick={() => {
                  setSearchTerm(item);
                  addToHistory(item, 'text');
                  navigate("/results");
                }}
              >
                <div className="p-2 rounded-full bg-gray-100 mr-3">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-gray-800">{item}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto rotate-[-90deg]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

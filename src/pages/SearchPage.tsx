import { useEffect, useState, useRef } from "react";
import { Search, X, Camera, Mic, ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import SearchSuggestions from "@/components/SearchSuggestions";
import { motion, AnimatePresence } from "framer-motion";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm, isListening, setIsListening } = useSearch();
  const [focusedInput, setFocusedInput] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraCapturing, setCameraCapturing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stateOpenCamera = location.state?.openCamera;
    if (stateOpenCamera) {
      setOpenCamera(true);
      startCamera();
    }
  }, [location.state]);

  useEffect(() => {
    if (inputRef.current && !openCamera) {
      inputRef.current.focus();
    }
  }, [openCamera]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
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
    }
  };

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        videoRef.current.srcObject = stream;
        setCameraCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleCameraToggle = () => {
    if (openCamera) {
      stopCamera();
      setOpenCamera(false);
      setSelectedImage(null);
    } else {
      setOpenCamera(true);
      startCamera();
    }
  };

  const handleSearchWithImage = () => {
    navigate("/results");
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
              <div className="search-bar-container">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="Search Google or type a URL"
                  className="flex-1 bg-transparent text-base"
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
                      <div className="w-5 h-5 rounded-full bg-google-blue animate-pulse-custom"></div>
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

        {!openCamera && focusedInput && searchTerm && (
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
                    >
                      Retake
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      onClick={handleSearchWithImage}
                    >
                      Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-5/6 h-5/6 border-2 border-white rounded-lg"></div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {cameraCapturing && (
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

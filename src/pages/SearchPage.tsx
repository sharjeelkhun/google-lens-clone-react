
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { 
  ArrowLeft, X, Camera, Mic, Search, 
  Upload, Grid, Settings, Clock, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTextSearchResults } from "@/data/mockSearchResults";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import { motion, AnimatePresence } from "framer-motion";
import SearchSuggestions from "@/components/SearchSuggestions";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    searchTerm, 
    setSearchTerm, 
    searchImage, 
    setSearchImage,
    isListening,
    setIsListening,
    clearSearch,
    addToHistory
  } = useSearch();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside of suggestions to close them
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if we should open camera immediately
  useEffect(() => {
    const state = location.state as { openCamera?: boolean } | null;
    if (state?.openCamera) {
      handleCameraClick();
    }
    
    // Focus on the search input when the page loads
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.state]);

  // Filter search results based on input
  useEffect(() => {
    if (searchTerm && !cameraActive) {
      // Simulating search results
      const filteredResults = mockTextSearchResults.filter(result => 
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filteredResults);
      setShowResults(filteredResults.length > 0);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, cameraActive]);

  const handleCameraClick = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access not supported by your browser");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraActive(true);
      setShowCameraOptions(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Failed to access camera: " + (err as Error).message);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      // Flash animation
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 300);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      // Convert canvas to blob/file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          
          setSearchImage({
            file,
            preview: imageUrl
          });
          
          // Add to search history
          addToHistory("", "image", imageUrl);
          
          // Stop camera stream
          const stream = videoRef.current?.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          // Navigate to results page
          navigate('/results');
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setSearchImage({
        file,
        preview: imageUrl
      });
      
      // Add to search history
      addToHistory("", "image", imageUrl);
      
      // Navigate to results page
      navigate('/results');
    }
  };

  const handleMicClick = () => {
    const started = startSpeechRecognition(
      (text) => setSearchTerm(text),
      (listening) => setIsListening(listening),
      { interimResults: true }
    );
    
    if (!started) {
      console.error("Speech recognition failed to start");
    }
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to search history
      addToHistory(searchTerm, "text");
      
      navigate('/results');
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    addToHistory(suggestion, "text");
    navigate('/results');
  };

  const handleSelectGallery = () => {
    fileInputRef.current?.click();
  };

  const handleCancelCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setShowCameraOptions(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {cameraActive ? (
        <motion.div 
          className="flex flex-col h-screen relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            <motion.button 
              onClick={handleCancelCamera}
              className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            {/* Flash effect overlay */}
            <AnimatePresence>
              {flashActive && (
                <motion.div 
                  className="absolute inset-0 bg-white z-20"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </div>
          
          {/* Camera View */}
          <video 
            ref={videoRef} 
            className="h-full w-full object-cover"
            autoPlay 
            playsInline
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera UI Overlay - Viewfinder */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="w-64 h-64 border-2 border-white rounded-lg"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
            <motion.button 
              onClick={handleCapture}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-14 h-14 border-2 border-gray-300 rounded-full"></div>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <header className="p-4 flex items-center space-x-3 bg-white sticky top-0 z-10 shadow-sm">
            <motion.button 
              onClick={() => navigate('/')} 
              className="flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5 text-google-dark-gray" />
            </motion.button>
            
            <div className="flex-1 relative" ref={suggestionsRef}>
              <form onSubmit={handleTextSearch}>
                <div className="search-bar-container">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search Google or type a URL"
                    className="flex-1 bg-transparent"
                    autoFocus
                  />
                  <div className="flex items-center space-x-3">
                    {searchTerm && (
                      <motion.button 
                        type="button" 
                        onClick={() => setSearchTerm('')}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <X className="w-5 h-5 text-google-dark-gray" />
                      </motion.button>
                    )}
                    {isListening && (
                      <motion.div 
                        className="w-4 h-4 rounded-full bg-google-blue mr-1"
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5
                        }}
                      ></motion.div>
                    )}
                    <motion.button 
                      type="button" 
                      onClick={handleMicClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mic className="w-5 h-5 text-google-dark-gray" />
                    </motion.button>
                    <motion.button 
                      type="button" 
                      onClick={handleCameraClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="w-5 h-5 text-google-dark-gray" />
                    </motion.button>
                  </div>
                </div>
              </form>
              
              {/* Search suggestions */}
              <AnimatePresence>
                {showSuggestions && searchTerm && (
                  <div className="absolute w-full">
                    <SearchSuggestions
                      searchTerm={searchTerm}
                      onSelectSuggestion={handleSelectSuggestion}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </header>
          
          {/* Search Options when not searching */}
          {!showResults && searchTerm.length === 0 && showCameraOptions && (
            <motion.div 
              className="flex flex-col items-center justify-center flex-1 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="text-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                <Camera size={48} className="mx-auto mb-4 text-google-blue" />
                <h2 className="text-xl font-medium mb-2">Search with your camera</h2>
                <p className="text-gray-600">Take a photo or import an existing one</p>
              </motion.div>
              
              <div className="flex flex-col w-full max-w-xs space-y-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                >
                  <Button 
                    onClick={handleCameraClick} 
                    className="bg-google-blue hover:bg-google-blue/90 text-white flex items-center justify-center py-6 w-full"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Use camera
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={handleSelectGallery}
                    className="flex items-center justify-center py-6 border-gray-300 w-full"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Choose image
                  </Button>
                </motion.div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
          
          {/* Search Results */}
          {showResults && (
            <motion.div 
              className="flex-1 p-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <motion.div 
                      key={result.id} 
                      className="border-b border-gray-200 pb-3"
                      onClick={() => {
                        setSearchTerm(result.title);
                        addToHistory(result.title, "text");
                        navigate('/results');
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <div className="flex items-center mb-1">
                        <img 
                          src={result.favicon} 
                          alt={result.title} 
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-green-700 text-sm">{result.url}</span>
                      </div>
                      <h3 className="text-lg text-blue-700 mb-1 font-normal">{result.title}</h3>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchTerm}"
                </div>
              )}
            </motion.div>
          )}
          
          {/* Bottom Navigation */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t flex justify-around shadow-md"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          >
            <motion.div 
              className="flex flex-col items-center text-google-blue"
              whileHover={{ scale: 1.1 }}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1">Search</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-gray-500"
              whileHover={{ scale: 1.1 }}
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs mt-1">Lens</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center text-gray-500"
              whileHover={{ scale: 1.1 }}
            >
              <Grid className="w-5 h-5" />
              <span className="text-xs mt-1">Discover</span>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SearchPage;

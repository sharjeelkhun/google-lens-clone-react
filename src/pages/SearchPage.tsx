
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { ArrowLeft, X, Camera, Mic, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTextSearchResults } from "@/data/mockSearchResults";

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
    clearSearch
  } = useSearch();
  
  const [cameraActive, setCameraActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if we should open camera immediately
  useEffect(() => {
    const state = location.state as { openCamera?: boolean } | null;
    if (state?.openCamera) {
      handleCameraClick();
    }
  }, [location.state]);

  useEffect(() => {
    if (searchTerm && !cameraActive) {
      // Simulating search results
      const filteredResults = mockTextSearchResults.filter(result => 
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filteredResults);
      setShowResults(true);
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
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Failed to access camera: " + (err as Error).message);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
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
      
      // Navigate to results page
      navigate('/results');
    }
  };

  const handleMicClick = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/results');
    }
  };

  const handleSelectGallery = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {cameraActive ? (
        <div className="flex flex-col h-screen relative">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            <button 
              onClick={() => {
                setCameraActive(false);
                // Stop camera stream
                const stream = videoRef.current?.srcObject as MediaStream;
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
              }}
              className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full text-white"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          {/* Camera View */}
          <video 
            ref={videoRef} 
            className="h-full w-full object-cover"
            autoPlay 
            playsInline
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
            <button 
              onClick={handleCapture}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
            >
              <div className="w-14 h-14 border-2 border-gray-300 rounded-full"></div>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="p-4 flex items-center space-x-3">
            <button onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5 text-google-dark-gray" />
            </button>
            
            <form onSubmit={handleTextSearch} className="flex-1">
              <div className="search-bar-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search or type URL"
                  className="flex-1 bg-transparent"
                  autoFocus
                />
                <div className="flex items-center space-x-3">
                  {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm('')}>
                      <X className="w-5 h-5 text-google-dark-gray" />
                    </button>
                  )}
                  {isListening && (
                    <div className="w-4 h-4 rounded-full bg-google-blue animate-pulse mr-1"></div>
                  )}
                  <button type="button" onClick={handleMicClick}>
                    <Mic className="w-5 h-5 text-google-dark-gray" />
                  </button>
                  <button type="button" onClick={handleCameraClick}>
                    <Camera className="w-5 h-5 text-google-dark-gray" />
                  </button>
                </div>
              </div>
            </form>
          </header>
          
          {/* Search Options when not searching */}
          {!showResults && (
            <div className="flex flex-col items-center justify-center flex-1 p-6">
              <div className="text-center mb-8">
                <Camera size={50} className="mx-auto mb-4 text-google-blue" />
                <h2 className="text-xl font-medium mb-2">Search with your camera</h2>
                <p className="text-gray-600">Take a photo or import an existing one</p>
              </div>
              
              <div className="flex flex-col w-full max-w-xs space-y-4">
                <Button 
                  onClick={handleCameraClick} 
                  className="bg-google-blue hover:bg-google-blue/90 text-white flex items-center justify-center py-6"
                >
                  <Camera className="mr-2" />
                  Use camera
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleSelectGallery}
                  className="flex items-center justify-center py-6"
                >
                  <Upload className="mr-2" />
                  Choose image
                </Button>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {showResults && (
            <div className="flex-1 p-4 overflow-y-auto">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map(result => (
                    <div key={result.id} className="border-b border-gray-200 pb-3">
                      <div className="flex items-center mb-1">
                        <img 
                          src={result.favicon} 
                          alt={result.title} 
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-green-700 text-sm">{result.url}</span>
                      </div>
                      <h3 className="text-lg text-blue-700 mb-1">{result.title}</h3>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-around">
            <div className="flex flex-col items-center text-google-blue">
              <Search className="w-6 h-6" />
              <span className="text-xs mt-1">Search</span>
            </div>
            <div className="flex flex-col items-center text-gray-500">
              <Camera className="w-6 h-6" />
              <span className="text-xs mt-1">Lens</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;

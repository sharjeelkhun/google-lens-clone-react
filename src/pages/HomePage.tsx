
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { Search, Mic, Camera, User, Grid, Settings, Bookmark, Calendar, Bell, MapPin } from "lucide-react";
import { newsArticles, discoverCards } from "@/data/mockSearchResults";
import { useState, useEffect } from "react";
import { startSpeechRecognition } from "@/utils/speechRecognition";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, isListening, setIsListening } = useSearch();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [weatherData, setWeatherData] = useState({ temp: "23°", condition: "Sunny" });

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/results');
    }
  };

  const handleCameraClick = () => {
    navigate('/search', { state: { openCamera: true } });
  };

  const handleMicClick = () => {
    const started = startSpeechRecognition(
      (text) => setSearchTerm(text),
      (listening) => setIsListening(listening)
    );
    
    if (!started) {
      console.error("Speech recognition failed to start");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - full width */}
      <motion.header 
        className="p-4 flex justify-between items-center header-full-width"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-custom flex justify-between items-center w-full">
          <div className="flex space-x-4">
            <span className="text-sm font-medium text-google-blue">All</span>
            <span className="text-sm text-gray-500">Images</span>
          </div>

          <div className="flex items-center">
            {weatherData && (
              <div className="mr-4 flex items-center text-sm">
                <span className="font-medium">{weatherData.temp}</span>
                <span className="ml-1 text-gray-500">{weatherData.condition}</span>
              </div>
            )}
            
            <div className="flex gap-4 items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Grid className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                {showNotificationBadge && (
                  <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-google-red" />
                )}
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              {isSignedIn ? (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center"
                >
                  U
                </motion.div>
              ) : (
                <motion.button 
                  className="text-google-blue font-medium px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => setIsSignedIn(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - contained */}
      <div className="main-content flex-grow">
        {/* Date Display */}
        <motion.div 
          className="py-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-500">{formatDate(currentDateTime)}</p>
        </motion.div>

        {/* Google Logo */}
        <motion.div 
          className="flex justify-center mt-16 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
        >
          <div className="flex items-center">
            <span className="text-google-blue text-7xl font-normal">G</span>
            <span className="text-google-red text-7xl font-normal">o</span>
            <span className="text-google-yellow text-7xl font-normal">o</span>
            <span className="text-google-blue text-7xl font-normal">g</span>
            <span className="text-google-green text-7xl font-normal">l</span>
            <span className="text-google-red text-7xl font-normal">e</span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <motion.form 
            onSubmit={handleSearch} 
            className="relative max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="search-bar-container rounded-full border shadow-sm hover:shadow-md transition-shadow">
              <Search className="text-google-dark-gray w-5 h-5 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Google or type a URL"
                className="flex-1 bg-transparent text-base"
                onClick={() => navigate('/search')}
              />
              <div className="flex items-center space-x-3">
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
                <button 
                  type="button" 
                  onClick={handleMicClick}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <Mic className="w-5 h-5 text-google-dark-gray" />
                </button>
                <button 
                  type="button" 
                  onClick={handleCameraClick}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <Camera className="w-5 h-5 text-google-dark-gray" />
                </button>
              </div>
            </div>
          </motion.form>
        </div>

        {/* Google Search Buttons */}
        <motion.div 
          className="flex justify-center space-x-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm text-gray-700 rounded"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Google Search
          </motion.button>
          <motion.button 
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm text-gray-700 rounded"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            I'm Feeling Lucky
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-medium text-gray-800 mb-3 px-1">Quick access</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <Bookmark className="text-google-blue" />, name: "Bookmarks" },
              { icon: <Calendar className="text-google-green" />, name: "Calendar" },
              { icon: <MapPin className="text-google-red" />, name: "Maps" },
              { icon: <Bell className="text-google-yellow" />, name: "Notifications" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                  {item.icon}
                </div>
                <span className="text-xs text-gray-700">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discover Section */}
        <motion.div 
          className="mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.2 }}
        >
          <h2 className="text-lg font-medium text-gray-800 mb-3 px-1">Discover</h2>
          <div className="grid grid-cols-2 gap-3">
            {discoverCards.map(card => (
              <motion.div 
                key={card.id} 
                variants={itemVariants}
                className="p-4 rounded-xl flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${card.color} text-white`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* News Feed */}
        <motion.div 
          className="mt-6 pb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.4 }}
        >
          <h2 className="text-lg font-medium text-gray-800 mb-3 px-1">For you</h2>
          <div className="space-y-4">
            {newsArticles.map(article => (
              <motion.div 
                key={article.id}
                variants={itemVariants} 
                className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span>{article.source}</span>
                    <span className="mx-1">•</span>
                    <span>{article.timeAgo}</span>
                  </div>
                </div>
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    loading="lazy" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation - full width */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t flex justify-around shadow-lg footer-full-width"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
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
          onClick={() => navigate('/search', { state: { openCamera: true } })}
        >
          <Camera className="w-5 h-5" />
          <span className="text-xs mt-1">Lens</span>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center text-gray-500"
          whileHover={{ scale: 1.1 }}
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Account</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;

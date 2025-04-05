
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { Search, Mic, Camera, User, Grid, Settings } from "lucide-react";
import { newsArticles, discoverCards } from "@/data/mockSearchResults";
import { useState } from "react";
import { startSpeechRecognition } from "@/utils/speechRecognition";

const HomePage = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, isListening, setIsListening } = useSearch();
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="text-sm">All</span>
          <span className="text-sm text-gray-500">Images</span>
        </div>
        <div className="flex gap-4 items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Grid className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          {isSignedIn ? (
            <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center">
              U
            </div>
          ) : (
            <button 
              className="text-google-blue font-medium px-6 py-2 rounded-md hover:bg-blue-50"
              onClick={() => setIsSignedIn(true)}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Google Logo */}
      <div className="flex justify-center mt-24 mb-6">
        <div className="flex items-center">
          <span className="text-google-blue text-7xl font-normal">G</span>
          <span className="text-google-red text-7xl font-normal">o</span>
          <span className="text-google-yellow text-7xl font-normal">o</span>
          <span className="text-google-blue text-7xl font-normal">g</span>
          <span className="text-google-green text-7xl font-normal">l</span>
          <span className="text-google-red text-7xl font-normal">e</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
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
      </div>

      {/* Google Search Buttons */}
      <div className="flex justify-center space-x-2 mb-8">
        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm text-gray-700 rounded">
          Google Search
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm text-gray-700 rounded">
          I'm Feeling Lucky
        </button>
      </div>

      {/* Discover Section */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-medium text-gray-800 mb-3 px-1">Discover</h2>
        <div className="grid grid-cols-2 gap-3">
          {discoverCards.map(card => (
            <div 
              key={card.id} 
              className="p-4 rounded-xl flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${card.color} text-white`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="px-4 mt-6 pb-20">
        <h2 className="text-lg font-medium text-gray-800 mb-3 px-1">For you</h2>
        <div className="space-y-4">
          {newsArticles.map(article => (
            <div key={article.id} className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 line-clamp-2">{article.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span>{article.source}</span>
                  <span className="mx-1">•</span>
                  <span>{article.timeAgo}</span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t flex justify-around shadow-md">
        <div className="flex flex-col items-center text-google-blue">
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <Camera className="w-5 h-5" />
          <span className="text-xs mt-1">Lens</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Account</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

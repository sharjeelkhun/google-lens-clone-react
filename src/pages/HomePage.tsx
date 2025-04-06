
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Search, Grid, ArrowRight, LogIn, Bell, ChevronDown, User, ChevronRight, Newspaper, CloudRain, Compass, Flame, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const HomePage = () => {
  const navigate = useNavigate();
  const { topSearches } = useSearch();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleCameraClick = () => {
    navigate('/search', { state: { openCamera: true } });
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
    setShowSignInModal(false);
  };

  const weatherData = {
    temperature: "24°",
    condition: "Partly Cloudy",
    location: "San Francisco"
  };

  const newsItems = [
    {
      id: 1,
      title: "Tech innovations driving sustainable energy solutions",
      source: "Tech Today",
      timeAgo: "2 hours ago",
      imageUrl: "https://picsum.photos/seed/news1/200/200"
    },
    {
      id: 2,
      title: "New AI breakthroughs in healthcare announced",
      source: "Science Daily",
      timeAgo: "5 hours ago",
      imageUrl: "https://picsum.photos/seed/news2/200/200"
    },
    {
      id: 3,
      title: "Global markets respond to economic policy changes",
      source: "Finance Report",
      timeAgo: "8 hours ago",
      imageUrl: "https://picsum.photos/seed/news3/200/200"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Account */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center">
          <span className="text-xl font-medium text-google-blue">Google</span>
        </div>
        
        {isSignedIn ? (
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            variant="outline" 
            className="text-google-blue border-google-blue text-sm h-8"
            onClick={() => setShowSignInModal(true)}
          >
            <LogIn className="w-4 h-4 mr-1" />
            Sign in
          </Button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto pb-20">
        {/* Google Logo */}
        <div className="flex justify-center my-6">
          <svg viewBox="0 0 272 92" width="160" height="54">
            <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
            <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
            <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
            <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
          </svg>
        </div>

        {/* Search Bar */}
        <div 
          className="bg-white mx-4 flex items-center px-4 py-3 rounded-full border shadow-sm mb-8"
          onClick={handleSearchClick}
        >
          <Search className="text-gray-500 mr-3 w-5 h-5" />
          <span className="text-gray-500 flex-1">Search or type URL</span>
          <div className="flex space-x-2">
            <button onClick={(e) => {
              e.stopPropagation();
              handleCameraClick();
            }}>
              <Camera className="text-google-blue w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weather Card */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{weatherData.location}</h3>
                <p className="text-sm text-gray-500">{weatherData.condition}</p>
              </div>
              <div className="flex items-center">
                <CloudRain className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-2xl font-semibold">{weatherData.temperature}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Discover Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Discover</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: <Flame className="w-5 h-5" />, name: "Trending" },
              { icon: <ShoppingBag className="w-5 h-5" />, name: "Shopping" },
              { icon: <Newspaper className="w-5 h-5" />, name: "News" },
              { icon: <Compass className="w-5 h-5" />, name: "Maps" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  {item.icon}
                </div>
                <span className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* For You Feed */}
        <div>
          <h2 className="text-lg font-medium mb-3">For You</h2>
          <div className="space-y-4">
            {newsItems.map((item) => (
              <motion.div 
                key={item.id} 
                className="border rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <p className="text-sm text-gray-500">{item.source} • {item.timeAgo}</p>
                    <h3 className="font-medium line-clamp-2 mt-1">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-around shadow-md">
        <div className="flex flex-col items-center text-google-blue">
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center text-gray-500" onClick={() => navigate('/search', { state: { openCamera: true } })}>
          <Camera className="w-5 h-5" />
          <span className="text-xs mt-1">Lens</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <Grid className="w-5 h-5" />
          <span className="text-xs mt-1">Discover</span>
        </div>
      </nav>

      {/* Sign In Modal */}
      {showSignInModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSignInModal(false)}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 272 92" width="120" height="40">
                <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
                <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
                <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
                <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-center mb-2">Sign in</h2>
            <p className="text-center text-gray-600 mb-6">Use your Google Account</p>
            
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <label className="text-xs text-gray-500 block">Email or phone</label>
                <input type="email" className="w-full focus:outline-none" defaultValue="user@example.com" />
              </div>
              
              <div className="border rounded-md p-3">
                <label className="text-xs text-gray-500 block">Password</label>
                <input type="password" className="w-full focus:outline-none" defaultValue="••••••••" />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="link" className="text-google-blue px-0">
                Create account
              </Button>
              
              <Button 
                onClick={handleSignIn}
                className="bg-google-blue hover:bg-blue-700 text-white"
              >
                Sign in
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;

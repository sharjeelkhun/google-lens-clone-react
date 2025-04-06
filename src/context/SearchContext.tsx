
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { fetchSearchResults } from '@/api/searchApi';

type SearchImage = {
  file: File | null;
  preview: string | null;
  searchResults?: Array<any>;
};

type SearchHistory = {
  id: string;
  term: string;
  timestamp: Date;
  type: 'text' | 'image';
  imagePreview?: string | null;
};

type SearchSettings = {
  safeSearch: boolean;
  language: string;
  region: string;
  resultsPerPage: number;
};

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchImage: SearchImage;
  setSearchImage: (image: SearchImage) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  clearSearch: () => void;
  searchHistory: SearchHistory[];
  addToHistory: (term: string, type: 'text' | 'image', imagePreview?: string | null) => void;
  clearHistory: () => void;
  settings: SearchSettings;
  updateSettings: (newSettings: Partial<SearchSettings>) => void;
  recentSearches: string[];
  trendingSearches: string[];
  topSearches: string[];
};

const defaultSettings: SearchSettings = {
  safeSearch: true,
  language: 'en-US',
  region: 'US',
  resultsPerPage: 10
};

// Trending searches - these would normally come from an API but we'll hardcode for now
const initialTrendingSearches = [
  'AI news', 
  'vacation destinations', 
  'new smartphones 2025', 
  'remote work tips',
  'sustainable fashion',
  'electric vehicles',
  'web development 2025',
  'climate change solutions'
];

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchImage, setSearchImage] = useState<SearchImage>({ file: null, preview: null });
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [settings, setSettings] = useState<SearchSettings>(defaultSettings);
  const [trendingSearches, setTrendingSearches] = useState(initialTrendingSearches);
  const [topSearches, setTopSearches] = useState<string[]>([]);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('googleCloneSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    
    const savedHistory = localStorage.getItem('googleCloneSearchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string timestamps back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setSearchHistory(historyWithDates);
      } catch (e) {
        console.error('Failed to parse saved history:', e);
      }
    }
    
    // Simulate fetching trending searches from an API
    fetchTopSearchTerms();
  }, []);
  
  // Simulated API call to fetch top search terms
  const fetchTopSearchTerms = async () => {
    try {
      // In a real app, we would make an API call here
      // For now, we'll use some hardcoded values
      const mockTopSearches = [
        'breaking news',
        'weather forecast',
        'stock market today',
        'local restaurants',
        'sports scores',
        'movie reviews'
      ];
      
      setTimeout(() => {
        setTopSearches(mockTopSearches);
      }, 1000);
    } catch (error) {
      console.error('Error fetching top search terms:', error);
    }
  };
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('googleCloneSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('googleCloneSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchImage({ file: null, preview: null });
    setIsListening(false);
  }, []);

  const addToHistory = useCallback((term: string, type: 'text' | 'image', imagePreview?: string | null) => {
    if (!term.trim() && type === 'text') return;
    
    setSearchHistory(prev => {
      const newItem: SearchHistory = {
        id: Date.now().toString(),
        term,
        timestamp: new Date(),
        type,
        imagePreview
      };
      
      // Limit history size to prevent excessive storage use
      const withNewItem = [newItem, ...prev];
      if (withNewItem.length > 100) {
        return withNewItem.slice(0, 100);
      }
      return withNewItem;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('googleCloneSearchHistory');
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SearchSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  // Get recent text searches for suggestions
  const recentSearches = searchHistory
    .filter(item => item.type === 'text')
    .map(item => item.term)
    .slice(0, 5);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchImage,
        setSearchImage,
        isListening,
        setIsListening,
        clearSearch,
        searchHistory,
        addToHistory,
        clearHistory,
        settings,
        updateSettings,
        recentSearches,
        trendingSearches,
        topSearches
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};


import { useState, useEffect } from "react";
import { useSearch } from "@/context/SearchContext";
import { Search, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

type SearchSuggestionsProps = {
  onSelectSuggestion: (suggestion: string) => void;
  searchTerm: string;
};

const SearchSuggestions = ({ onSelectSuggestion, searchTerm }: SearchSuggestionsProps) => {
  const { recentSearches, trendingSearches } = useSearch();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      // When search input is empty, show recent and trending searches
      const combinedSuggestions = Array.from(
        new Set([...recentSearches, ...trendingSearches])
      ).slice(0, 10);
      setSuggestions(combinedSuggestions);
      return;
    }
    
    // Filter suggestions based on search term
    const term = searchTerm.toLowerCase();
    const matched = [
      // First any exact matches from recent searches
      ...recentSearches.filter(item => item.toLowerCase().includes(term)),
      // Then trending searches
      ...trendingSearches.filter(item => item.toLowerCase().includes(term)),
      // Then generate some additional suggestions
      `${searchTerm} news`,
      `${searchTerm} near me`,
      `how to ${searchTerm}`,
      `best ${searchTerm}`,
      `${searchTerm} 2025`
    ];
    
    // Deduplicate and sort by relevance
    const uniqueMatched = Array.from(new Set(matched)).slice(0, 8);
    setSuggestions(uniqueMatched);
  }, [searchTerm, recentSearches, trendingSearches]);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg mt-1 overflow-hidden max-h-[70vh] overflow-y-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
    >
      <ul className="py-2">
        {suggestions.map((suggestion, index) => {
          const isRecent = recentSearches.includes(suggestion);
          const isTrending = trendingSearches.includes(suggestion);
          
          return (
            <motion.li
              key={index}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => onSelectSuggestion(suggestion)}
              whileHover={{ backgroundColor: "#f8f9fa" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {isRecent ? (
                <Clock size={16} className="text-gray-500 mr-3" />
              ) : isTrending ? (
                <TrendingUp size={16} className="text-gray-500 mr-3" />
              ) : (
                <Search size={16} className="text-gray-500 mr-3" />
              )}
              
              <span className="text-sm">{suggestion}</span>
            </motion.li>
          );
        })}
      </ul>
      
      {suggestions.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No suggestions found
        </div>
      )}
    </motion.div>
  );
};

export default SearchSuggestions;

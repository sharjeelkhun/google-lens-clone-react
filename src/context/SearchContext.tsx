
import { createContext, useContext, useState, ReactNode } from 'react';

type SearchImage = {
  file: File | null;
  preview: string | null;
  searchResults?: Array<any>;
};

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchImage: SearchImage;
  setSearchImage: (image: SearchImage) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchImage, setSearchImage] = useState<SearchImage>({ file: null, preview: null });
  const [isListening, setIsListening] = useState(false);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchImage({ file: null, preview: null });
    setIsListening(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchImage,
        setSearchImage,
        isListening,
        setIsListening,
        clearSearch
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

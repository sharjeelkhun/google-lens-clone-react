
import { toast } from "@/hooks/use-toast";

export type SearchOptions = {
  query: string;
  type?: 'web' | 'image';
  numberOfResults?: number;
};

export type SearchResult = {
  title: string;
  link: string;
  description: string;
  favicon?: string;
  source?: string;
  date?: string;
};

export type ImageSearchResult = {
  title: string;
  link: string;
  source: string;
  imageUrl: string;
  description?: string;
};

export type ShoppingResult = {
  title: string;
  link: string;
  price: string;
  store: string;
  imageUrl: string;
};

export type SearchResponse = {
  searchResults: SearchResult[];
  visualMatches?: ImageSearchResult[];
  shoppingResults?: ShoppingResult[];
  relatedSearches?: string[];
  answer?: string;
  additionalInfo?: string;
};

// Using Wikipedia API as a free alternative that allows CORS
export const fetchSearchResults = async (options: SearchOptions): Promise<SearchResponse> => {
  const { query, type = 'web', numberOfResults = 10 } = options;
  
  try {
    // Use Wikipedia API which allows CORS and is free
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=${numberOfResults}`;
    
    console.log('Fetching search results from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Wikipedia API response to our app's format
    return transformWikipediaResponse(data, query);
  } catch (error) {
    console.error('Error fetching search results:', error);
    toast({
      title: "Search API Error",
      description: "Using fallback search results. API might be unavailable.",
      variant: "destructive"
    });
    
    // Fallback to mock data
    return getMockSearchResults(type);
  }
};

// For image search using the image as input
export const fetchImageSearchResults = async (imageFile: File): Promise<SearchResponse> => {
  try {
    // Convert image to base64 for API submission
    const base64Image = await fileToBase64(imageFile);
    
    // In a real implementation, you would upload this to Google Lens API
    // For now, we'll simulate with a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Fallback to mock image search data
    return getMockImageSearchResults();
  } catch (error) {
    console.error('Error in image search:', error);
    toast({
      title: "Image Search Failed",
      description: "Using fallback results. Image search API might be unavailable.",
      variant: "destructive"
    });
    
    // Fallback to mock data
    return getMockImageSearchResults();
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Transform Wikipedia API response to our app's format
const transformWikipediaResponse = (apiResponse: any, query: string): SearchResponse => {
  if (apiResponse.query && apiResponse.query.search) {
    // Extract search results from Wikipedia
    const searchResults: SearchResult[] = apiResponse.query.search.map((result: any) => {
      // Strip HTML tags from snippet
      const plainTextSnippet = result.snippet.replace(/<\/?[^>]+(>|$)/g, "");
      
      return {
        title: result.title || 'Wikipedia Result',
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        description: plainTextSnippet || 'No description available',
        favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
        source: 'Wikipedia',
        date: new Date(result.timestamp).toLocaleDateString()
      };
    });
    
    // Generate related searches based on the query
    const relatedSearches = generateRelatedSearches(query);
    
    // Return structured data
    return {
      searchResults,
      relatedSearches,
      // For Wikipedia, we don't have these features but could add them later
      visualMatches: [],
      shoppingResults: [],
    };
  }
  
  // Default fallback to mock data
  return getMockSearchResults('web');
};

// Helper function to generate related searches based on the query
const generateRelatedSearches = (query: string): string[] => {
  const baseTerms = ['what is', 'how to', 'history of', 'facts about', 'examples of'];
  return baseTerms.map(term => `${term} ${query}`).slice(0, 5);
};

// Helper function to get mock search results
const getMockSearchResults = (type: 'web' | 'image'): SearchResponse => {
  if (type === 'image') {
    return getMockImageSearchResults();
  }
  
  // Import the mock data and return formatted response
  return {
    searchResults: getMockTextSearchResults(),
    relatedSearches: [
      "google search api",
      "serpapi alternative",
      "free search api",
      "google custom search",
      "search engine api"
    ]
  };
};

// Helper function to get mock image search results
const getMockImageSearchResults = (): SearchResponse => {
  // Import the mock image search data
  const mockData = require('@/data/mockSearchResults').mockImageSearchResults;
  
  // Ensure the data conforms to our SearchResponse type
  return {
    searchResults: mockData.searchResults.map((item: any): SearchResult => ({
      title: item.title || '',
      link: '#',
      description: item.additionalInfo || item.answer || '',
    })),
    visualMatches: mockData.visualMatches,
    shoppingResults: mockData.shoppingResults,
    relatedSearches: [
      "similar images", 
      "visual search", 
      "image recognition",
      "reverse image search"
    ],
    answer: mockData.searchResults[0]?.answer || '',
    additionalInfo: mockData.searchResults[0]?.additionalInfo || ''
  };
};

// Helper function to get mock text search results
const getMockTextSearchResults = (): SearchResult[] => {
  return require('@/data/mockSearchResults').mockTextSearchResults;
};


import { toast } from "@/components/ui/use-toast";

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

// Using SerpAPI for search results
// Fallback to mock data if API call fails or limits are reached
export const fetchSearchResults = async (options: SearchOptions): Promise<SearchResponse> => {
  const { query, type = 'web', numberOfResults = 10 } = options;
  
  try {
    // For demonstration purposes, we'll use the public API key
    // In a production app, this would be stored in a server environment variable
    const apiKey = 'demo'; // SerpAPI provides a demo key with limited functionality
    
    // Construct the API URL with appropriate parameters
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    
    console.log('Fetching search results from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the API response into our app's format
    return transformApiResponse(data, type);
  } catch (error) {
    console.error('Error fetching search results:', error);
    toast({
      title: "Search API Error",
      description: "Using fallback search results. API might be unavailable or rate-limited.",
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

// Transform API response to our app's format
const transformApiResponse = (apiResponse: any, type: 'web' | 'image'): SearchResponse => {
  if (type === 'web' && apiResponse.organic_results) {
    // Extract search results
    const searchResults: SearchResult[] = apiResponse.organic_results.map((result: any) => ({
      title: result.title || 'Search Result',
      link: result.link || 'https://example.com',
      description: result.snippet || 'No description available',
      favicon: result.favicon || 'https://www.google.com/favicon.ico',
      source: result.displayed_link || 'example.com'
    }));
    
    // Extract related searches if available
    const relatedSearches = apiResponse.related_searches?.map((item: any) => item.query) || [];
    
    // Extract featured snippet if available
    let answer = '';
    let additionalInfo = '';
    if (apiResponse.answer_box) {
      answer = apiResponse.answer_box.answer || apiResponse.answer_box.snippet || '';
      additionalInfo = apiResponse.answer_box.snippet || '';
    }
    
    // Return structured data
    return {
      searchResults,
      relatedSearches,
      answer,
      additionalInfo,
      // If there are image results, include them
      visualMatches: extractVisualMatches(apiResponse),
      // If there are shopping results, include them
      shoppingResults: extractShoppingResults(apiResponse),
    };
  }
  
  if (type === 'image') {
    // For image search, return mock data
    return getMockImageSearchResults();
  }
  
  // Default fallback to mock data
  return getMockSearchResults(type);
};

// Helper function to extract visual matches from API response
const extractVisualMatches = (apiResponse: any): ImageSearchResult[] => {
  const imageResults = apiResponse.images_results || [];
  return imageResults.slice(0, 6).map((img: any) => ({
    title: img.title || 'Image result',
    link: img.link || img.original || '#',
    source: img.source || 'Google Images',
    imageUrl: img.thumbnail || img.original || 'https://via.placeholder.com/150',
    description: img.snippet || ''
  }));
};

// Helper function to extract shopping results from API response
const extractShoppingResults = (apiResponse: any): ShoppingResult[] => {
  const shoppingResults = apiResponse.shopping_results || [];
  return shoppingResults.slice(0, 6).map((item: any) => ({
    title: item.title || 'Product',
    link: item.link || '#',
    price: item.price || 'N/A',
    store: item.source || 'Online Store',
    imageUrl: item.thumbnail || 'https://via.placeholder.com/150'
  }));
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

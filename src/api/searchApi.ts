
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

// Using a free API from https://serpapi.com (you get 100 free searches per month)
// Fallback to mock data if API call fails or limits are reached
export const fetchSearchResults = async (options: SearchOptions): Promise<SearchResponse> => {
  const { query, type = 'web', numberOfResults = 10 } = options;

  // API key would normally be stored in an environment variable
  // For this demo, we'll use a public API that doesn't require a key
  try {
    const baseUrl = 'https://serpapi.com/search.json';
    const url = new URL('https://serpapi.com/search');
    url.searchParams.append('engine', 'google');
    url.searchParams.append('q', query);
    url.searchParams.append('num', numberOfResults.toString());
    
    // For demo purposes, we'll use this API that doesn't require authentication
    // But it has limited functionality - consider using a free API key with SerpAPI
    const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=demo`);
    
    if (!response.ok) {
      throw new Error('Search API request failed');
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
    return import('@/data/mockSearchResults').then(module => {
      return type === 'image' ? module.mockImageSearchResults : { searchResults: module.mockTextSearchResults };
    });
  }
};

// For image search using the image as input
export const fetchImageSearchResults = async (imageFile: File): Promise<SearchResponse> => {
  try {
    // Convert image to base64 for API submission
    const base64Image = await fileToBase64(imageFile);
    
    // In a real implementation, you would upload this to a service like Google Lens API
    // For now, we'll simulate with a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Fallback to mock data
    return import('@/data/mockSearchResults').then(module => {
      return module.mockImageSearchResults;
    });
  } catch (error) {
    console.error('Error in image search:', error);
    toast({
      title: "Image Search Failed",
      description: "Using fallback results. Image search API might be unavailable.",
      variant: "destructive"
    });
    
    // Fallback to mock data
    return import('@/data/mockSearchResults').then(module => {
      return module.mockImageSearchResults;
    });
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
  // For demo purposes, we'll still fallback to mock data
  // In a real implementation, you would parse the API response
  
  if (apiResponse.organic_results && type === 'web') {
    const searchResults = apiResponse.organic_results.map((result: any) => ({
      id: Math.random().toString(36).substring(2),
      title: result.title || 'Search Result',
      link: result.link || 'https://example.com',
      description: result.snippet || 'No description available',
      favicon: result.favicon || 'https://www.google.com/favicon.ico',
      url: result.displayed_link || 'example.com'
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
    
    return {
      searchResults,
      relatedSearches,
      answer,
      additionalInfo
    };
  }
  
  if (type === 'image') {
    // For image search, we would parse image results
    // Fallback to mock data for now
    return import('@/data/mockSearchResults').then(module => module.mockImageSearchResults);
  }
  
  // Fallback to mock data
  return import('@/data/mockSearchResults').then(module => {
    return type === 'image' ? module.mockImageSearchResults : { searchResults: module.mockTextSearchResults };
  });
};

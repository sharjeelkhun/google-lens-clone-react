
import { toast } from "@/hooks/use-toast";

export type SearchOptions = {
  query: string;
  type?: 'web' | 'image';
  numberOfResults?: number;
};

export type SearchResult = {
  id?: string;
  title: string;
  link?: string;
  url?: string;
  description: string;
  domain?: string;
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
    console.log("Processing image search for file:", imageFile.name);
    
    // Convert image to base64 for API submission
    const base64Image = await fileToBase64(imageFile);
    console.log("Image converted to base64 successfully");
    
    // In a real implementation, you would upload this to Google Lens API
    // For now, we'll simulate with a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get mock image search data
    const mockData = getMockImageSearchResults();
    console.log("Image search mock data retrieved:", mockData.visualMatches?.length || 0, "visual matches");
    
    // Make sure visualMatches exists and is an array
    if (!mockData.visualMatches || !Array.isArray(mockData.visualMatches)) {
      mockData.visualMatches = [];
    }
    
    // Make sure searchResults exists and is an array
    if (!mockData.searchResults || !Array.isArray(mockData.searchResults)) {
      mockData.searchResults = [];
    }
    
    return mockData;
  } catch (error) {
    console.error('Error in image search:', error);
    toast({
      title: "Image Search Failed",
      description: "Using fallback results. Image search API might be unavailable.",
      variant: "destructive"
    });
    
    // Fallback to mock data with guaranteed structure
    const fallbackData = getMockImageSearchResults();
    
    // Ensure all required properties exist
    return {
      searchResults: fallbackData.searchResults || [],
      visualMatches: fallbackData.visualMatches || [],
      shoppingResults: fallbackData.shoppingResults || [],
      relatedSearches: fallbackData.relatedSearches || []
    };
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
        id: result.pageid?.toString() || String(Math.random()),
        title: result.title || 'Wikipedia Result',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        description: plainTextSnippet || 'No description available',
        domain: 'wikipedia.org',
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
  
  // Return formatted response
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
  // Create some fallback image search results if the imported ones fail
  const fallbackVisualMatches: ImageSearchResult[] = [
    {
      title: "Similar Object",
      link: "https://example.com/similar1",
      source: "Example Source",
      imageUrl: "https://via.placeholder.com/150",
      description: "A similar object found in our database"
    },
    {
      title: "Related Item",
      link: "https://example.com/related1",
      source: "Example Store",
      imageUrl: "https://via.placeholder.com/150",
      description: "A related item you might be interested in"
    }
  ];

  const fallbackShoppingResults: ShoppingResult[] = [
    {
      title: "Product Match",
      link: "https://example.com/product1",
      price: "$19.99",
      store: "Example Shop",
      imageUrl: "https://via.placeholder.com/150"
    }
  ];

  try {
    // Import the mock image search data
    const mockData = require('@/data/mockSearchResults').mockImageSearchResults;
    
    // Ensure the data conforms to our SearchResponse type
    const formattedResponse: SearchResponse = {
      searchResults: Array.isArray(mockData.searchResults) 
        ? mockData.searchResults.map((item: any): SearchResult => ({
            title: item.title || 'Unknown Title',
            link: item.link || '#',
            url: item.link || '#',
            description: item.description || item.additionalInfo || '',
            domain: new URL(item.link || 'https://example.com').hostname,
            source: item.source || 'Unknown Source'
          }))
        : [],
      visualMatches: Array.isArray(mockData.visualMatches) 
        ? mockData.visualMatches 
        : fallbackVisualMatches,
      shoppingResults: Array.isArray(mockData.shoppingResults) 
        ? mockData.shoppingResults 
        : fallbackShoppingResults,
      relatedSearches: [
        "similar images", 
        "visual search", 
        "image recognition",
        "reverse image search"
      ]
    };
    
    return formattedResponse;
  } catch (error) {
    console.error("Error loading mock image search data:", error);
    
    // Return fallback data
    return {
      searchResults: [],
      visualMatches: fallbackVisualMatches,
      shoppingResults: fallbackShoppingResults,
      relatedSearches: ["similar images", "visual search"]
    };
  }
};

// Helper function to get mock text search results
const getMockTextSearchResults = (): SearchResult[] => {
  try {
    return require('@/data/mockSearchResults').mockTextSearchResults;
  } catch (error) {
    console.error("Error loading mock text search results:", error);
    return [];
  }
};

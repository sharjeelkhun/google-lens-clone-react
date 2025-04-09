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
    console.log("Processing image search for file:", imageFile.name, "size:", imageFile.size);
    
    // Convert image to base64 for API submission
    const base64Image = await fileToBase64(imageFile);
    console.log("Image converted to base64 successfully, length:", base64Image.length);
    
    // In a real implementation, you would upload this to Google Lens API
    // For now, we'll simulate with a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get mock image search data - NO MORE using require()
    const mockData = getMockImageSearchResults();
    console.log("Image search mock data retrieved:", mockData.visualMatches?.length || 0, "visual matches");
    
    // Ensure we return properly structured data
    return mockData;
  } catch (error) {
    console.error('Error in image search:', error);
    toast({
      title: "Image Search Failed",
      description: "Using fallback results. Image search API might be unavailable.",
      variant: "destructive"
    });
    
    // Return fallback data with guaranteed structure
    return getFallbackImageSearchResults();
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

// Create fallback data for image searches
const getFallbackImageSearchResults = (): SearchResponse => {
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
    },
    {
      title: "Product Alternative",
      link: "https://example.com/product2",
      source: "Another Store",
      imageUrl: "https://via.placeholder.com/150",
      description: "A popular alternative product"
    }
  ];

  const fallbackShoppingResults: ShoppingResult[] = [
    {
      title: "Product Match",
      link: "https://example.com/product1",
      price: "$19.99",
      store: "Example Shop",
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      title: "Bargain Option",
      link: "https://example.com/bargain1",
      price: "$12.99",
      store: "Discount Store",
      imageUrl: "https://via.placeholder.com/150"
    }
  ];
  
  return {
    searchResults: [],
    visualMatches: fallbackVisualMatches,
    shoppingResults: fallbackShoppingResults,
    relatedSearches: ["similar images", "visual search", "image recognition", "reverse image search"]
  };
};

// Helper function to get mock image search results - REPLACED require() with hardcoded data
const getMockImageSearchResults = (): SearchResponse => {
  try {
    // Instead of require, use hardcoded mock data
    const visualMatches: ImageSearchResult[] = [
      {
        title: "Visual Match 1",
        link: "https://example.com/match1",
        source: "Example Website",
        imageUrl: "https://via.placeholder.com/300",
        description: "This is a visual match for your image search"
      },
      {
        title: "Visual Match 2",
        link: "https://example.com/match2",
        source: "Example Store",
        imageUrl: "https://via.placeholder.com/300/ff0000",
        description: "Another visual match with similar properties"
      },
      {
        title: "Visual Match 3", 
        link: "https://example.com/match3",
        source: "Example Gallery",
        imageUrl: "https://via.placeholder.com/300/00ff00",
        description: "A third visual match showing similar items"
      },
      {
        title: "Visual Match 4",
        link: "https://example.com/match4",
        source: "Example Collection",
        imageUrl: "https://via.placeholder.com/300/0000ff",
        description: "A fourth visual match for comprehensive results"
      }
    ];
    
    const shoppingResults: ShoppingResult[] = [
      {
        title: "Shopping Item 1",
        link: "https://example.com/shop1",
        price: "$24.99",
        store: "Online Store",
        imageUrl: "https://via.placeholder.com/200"
      },
      {
        title: "Shopping Item 2",
        link: "https://example.com/shop2",
        price: "$19.99",
        store: "Discount Market",
        imageUrl: "https://via.placeholder.com/200/ff0000"
      },
      {
        title: "Shopping Item 3",
        link: "https://example.com/shop3",
        price: "$32.99",
        store: "Premium Shop",
        imageUrl: "https://via.placeholder.com/200/00ff00"
      }
    ];
    
    const mockData: SearchResponse = {
      searchResults: [
        {
          id: "img-search-1",
          title: "Search Result from Image Analysis",
          url: "https://example.com/result1",
          link: "https://example.com/result1",
          description: "This is a web result based on your image search",
          domain: "example.com",
          favicon: "https://example.com/favicon.ico",
          source: "Example Results"
        },
        {
          id: "img-search-2", 
          title: "Related Information Found",
          url: "https://example.org/related-info",
          link: "https://example.org/related-info",
          description: "Additional information related to your image query",
          domain: "example.org",
          favicon: "https://example.org/favicon.ico",
          source: "Example Organization"
        }
      ],
      visualMatches: visualMatches,
      shoppingResults: shoppingResults,
      relatedSearches: ["similar images", "visual search", "image recognition", "reverse image search"]
    };
    
    console.log("Returning mock image search data with", mockData.visualMatches?.length || 0, "visual matches");
    return mockData;
    
  } catch (error) {
    console.error("Error creating mock image search data:", error);
    return getFallbackImageSearchResults();
  }
};

// Helper function to get mock text search results - REPLACED require() with empty array default
const getMockTextSearchResults = (): SearchResult[] => {
  // Simple mock text search results without using require
  return [
    {
      id: "text-1",
      title: "Google Search - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Google_Search",
      link: "https://en.wikipedia.org/wiki/Google_Search",
      description: "Google Search is a search engine provided by Google. Handling more than 3.5 billion searches per day, it has a 92% share of the global search engine market.",
      domain: "wikipedia.org",
      favicon: "https://en.wikipedia.org/favicon.ico",
      source: "Wikipedia",
      date: "2025-01-15"
    },
    {
      id: "text-2",
      title: "Google",
      url: "https://www.google.com",
      link: "https://www.google.com",
      description: "The official website for Google Search. Search the world's information, including webpages, images, videos and more.",
      domain: "google.com",
      favicon: "https://www.google.com/favicon.ico",
      source: "Google",
      date: "2025-04-01"
    }
  ];
};

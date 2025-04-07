
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { 
  ArrowLeft, 
  Camera, 
  Search, 
  MoreHorizontal, 
  ChevronLeft, 
  Mic, 
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSearchResults, fetchImageSearchResults, SearchResponse, SearchResult } from "@/api/searchApi";
import { useQuery } from "@tanstack/react-query";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext
} from "@/components/ui/pagination";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { searchTerm, searchImage } = useSearch();
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch search results using react-query
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm, searchImage?.file?.name],
    queryFn: async () => {
      if (searchImage.preview && searchImage.file) {
        return fetchImageSearchResults(searchImage.file);
      } else if (searchTerm) {
        return fetchSearchResults({ query: searchTerm });
      } else {
        navigate('/search');
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!(searchTerm || searchImage.preview)
  });

  // Redirect if no search term or image
  useEffect(() => {
    if (!searchTerm && !searchImage.preview) {
      navigate('/search');
    }
  }, [searchTerm, searchImage, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-google-blue rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-google-red rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-google-yellow rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          <div className="w-3 h-3 bg-google-green rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        </div>
        <p className="text-gray-500">Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-xl font-medium mb-2 text-google-red">Search Error</h2>
        <p className="text-center mb-4">Sorry, something went wrong with your search. Please try again.</p>
        <Button onClick={() => navigate('/search')}>Back to Search</Button>
      </div>
    );
  }

  if (!results) {
    return null;
  }
  
  const { visualMatches, searchResults, shoppingResults } = results as SearchResponse;

  // Format the displayed search time
  const searchTime = (Math.random() * 0.5 + 0.1).toFixed(2);
  
  // Function to render a single search result
  const renderSearchResult = (result: SearchResult, index: number) => {
    return (
      <div key={`${result.title}-${index}`} className="mb-6">
        <div className="flex items-center text-xs text-google-secondary-text mb-1">
          <img 
            src={result.favicon || "https://www.google.com/favicon.ico"} 
            alt={result.source || "Source"} 
            className="w-4 h-4 mr-2"
          />
          <span className="truncate">{result.source || "example.com"}</span>
          <MoreHorizontal size={12} className="ml-1" />
        </div>
        
        <h3 className="text-[#1a0dab] text-xl font-normal leading-tight mb-1">
          <a href={result.link} className="hover:underline">
            {result.title}
          </a>
        </h3>
        
        <p className="text-sm text-[#3c4043] line-clamp-3">
          {result.description}
        </p>
        
        {result.date && (
          <p className="text-xs text-google-secondary-text mt-1">
            {result.date}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center px-4 py-2 gap-2">
          <button onClick={() => navigate('/search')} className="flex-shrink-0">
            <ChevronLeft className="w-5 h-5 text-google-dark-gray" />
          </button>
          
          <div className="flex-1 bg-google-gray rounded-full px-4 py-2 flex items-center text-sm relative">
            {searchImage.preview ? (
              <span className="truncate">Search with image</span>
            ) : (
              <span className="truncate">{searchTerm}</span>
            )}
            <button className="absolute right-3">
              <span className="sr-only">Clear search</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#70757a]" style={{ fill: 'currentColor' }}>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button>
              <Mic className="w-5 h-5 text-google-blue" />
            </button>
            <button>
              <Camera className="w-5 h-5 text-google-dark-gray" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="bg-white border-b w-full h-10 justify-start pl-4">
            <TabsTrigger 
              value="all" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="images" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm"
            >
              Images
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm"
            >
              News
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm"
            >
              Maps
            </TabsTrigger>
            <TabsTrigger 
              value="shopping" 
              className="px-4 h-10 data-[state=active]:border-b-[3px] data-[state=active]:border-google-blue data-[state=active]:text-google-blue font-normal data-[state=active]:font-medium rounded-none data-[state=active]:shadow-none text-sm mr-4"
            >
              Shopping
            </TabsTrigger>
          </TabsList>

          {/* Search Tools */}
          <div className="px-4 py-3 text-xs text-[#70757a] flex justify-between items-center border-b">
            <span>About {Math.floor(Math.random() * 100000).toLocaleString()} results ({searchTime} seconds)</span>
            <button>
              <Settings size={14} />
            </button>
          </div>

          {/* Main Content */}
          <div className="pb-20">
            <TabsContent value="all" className="m-0 mt-2">
              {/* Featured Snippet/Answer Box (if available) */}
              {results.answer && (
                <div className="mx-4 mb-4 p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                  <h3 className="font-medium text-base mb-2">{searchResults?.[0]?.title || "Featured Snippet"}</h3>
                  <p className="text-sm text-[#202124]">{results.answer}</p>
                  {results.additionalInfo && (
                    <p className="text-xs mt-2 text-[#70757a]">{results.additionalInfo}</p>
                  )}
                </div>
              )}

              {/* Search Results */}
              <div className="px-4">
                {searchResults && searchResults.length > 0 && (
                  <div className="mb-6 space-y-6">
                    {searchResults.map((result, index) => renderSearchResult(result, index))}
                  </div>
                )}
              </div>

              {/* People Also Ask */}
              <div className="px-4 mb-6">
                <h3 className="text-base font-medium mb-3">People also ask</h3>
                <div className="space-y-2">
                  {["How does it work?", "What are the alternatives?", "Is it free to use?", "What are the requirements?"].map((question, i) => (
                    <div key={i} className="border border-[#dadce0] rounded-lg overflow-hidden">
                      <button className="w-full text-left p-3 text-[#202124] text-sm flex justify-between items-center">
                        <span>{question}</span>
                        <span className="text-xl">+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Related Searches */}
              {results.relatedSearches && results.relatedSearches.length > 0 && (
                <div className="px-4 mb-6">
                  <h3 className="text-base font-medium mb-3">Related searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.relatedSearches.map((item: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-[#f1f3f4] rounded-full px-4 py-2 text-sm text-[#3c4043]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Matches (if there's an image search) */}
              {searchImage.preview && visualMatches && visualMatches.length > 0 && (
                <div className="px-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium">Visual matches</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {visualMatches.slice(0, 6).map((item: any) => (
                      <div key={item.id} className="rounded-lg overflow-hidden">
                        <div className="bg-gray-50 h-28 overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs mt-1 line-clamp-2 text-[#202124]">{item.title}</p>
                        <p className="text-[10px] text-[#70757a]">{item.source}</p>
                      </div>
                    ))}
                  </div>
                  {visualMatches.length > 6 && (
                    <Button variant="ghost" className="mt-3 text-google-blue w-full text-sm">
                      View more
                    </Button>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              <div className="px-4 my-6">
                <Pagination>
                  <PaginationContent>
                    <div className="flex flex-col items-center w-full">
                      <div className="flex justify-center mb-5 items-center">
                        <svg className="h-24 w-24" viewBox="0 0 160 56" focusable="false">
                          <path d="M63.92 34.36a14.91 14.91 0 0 1-5.54-1c-1.57-.67-2.9-1.57-3.98-2.7a12.83 12.83 0 0 1-5.28-10.73c0-1.72.31-3.4.93-5.01a13.12 13.12 0 0 1 2.68-4.21 12.26 12.26 0 0 1 4.08-2.78c1.57-.68 3.3-1.02 5.14-1.02 1.9 0 3.64.34 5.23 1.03a12.06 12.06 0 0 1 4.03 2.8 13.09 13.09 0 0 1 2.63 4.21c.63 1.61.95 3.29.95 5.01h-2.54c0-.69-.08-1.37-.23-2.04-.45-2.02-1.41-3.75-2.9-5.2-1.48-1.45-3.36-2.38-5.63-2.8a11.6 11.6 0 0 0-1.51-.1c-1.4 0-2.67.24-3.82.72-1.15.49-2.16 1.15-3.04 2-1.76 1.7-2.84 3.95-3.24 6.74-.06.5-.1 1.01-.1 1.53 0 1.4.24 2.7.72 3.93a10.97 10.97 0 0 0 2.04 3.28c1.75 1.94 4.08 3.03 6.99 3.3.5.04 1 .06 1.48.06 1.41 0 2.72-.24 3.92-.73 1.2-.49 2.28-1.12 3.2-1.97a10.76 10.76 0 0 0 3.03-4.6c.35-1 .53-2.04.53-3.12h2.54c0 1.7-.32 3.3-.96 4.77a13.28 13.28 0 0 1-2.67 3.95 11.93 11.93 0 0 1-4.1 2.66c-1.57.66-3.28.98-5.14.98zm33.64-7.34c0 1.25-.22 2.4-.68 3.45-.45 1.06-1.09 1.97-1.94 2.75-.84.78-1.83 1.38-2.97 1.8-1.14.43-2.4.64-3.79.64-.99 0-1.95-.16-2.87-.46-.93-.3-1.8-.75-2.62-1.33a7.72 7.72 0 0 1-2-2.25 5.83 5.83 0 0 1-.8-3.07l2.58-.15c.05 1.63.63 2.93 1.73 3.92 1.1.98 2.47 1.47 4.09 1.47.88 0 1.7-.14 2.47-.42.76-.28 1.43-.67 1.98-1.16.56-.48.99-1.08 1.3-1.76.3-.7.46-1.46.46-2.3 0-.88-.2-1.64-.59-2.3-.4-.66-.9-1.2-1.52-1.63a9.07 9.07 0 0 0-2.08-1.02l-2.28-.82c-.76-.27-1.55-.58-2.36-.95a11.71 11.71 0 0 1-2.3-1.33 6.33 6.33 0 0 1-1.77-1.85c-.47-.73-.7-1.6-.7-2.6 0-1.18.23-2.23.72-3.14.47-.91 1.11-1.67 1.9-2.29a8 8 0 0 1 2.68-1.4 9.6 9.6 0 0 1 2.97-.47c.94 0 1.84.16 2.67.47.85.31 1.6.76 2.27 1.34.66.58 1.18 1.3 1.56 2.15.39.84.58 1.8.58 2.87h-2.48a4.34 4.34 0 0 0-.41-1.9 4.52 4.52 0 0 0-1.1-1.48c-.46-.4-1-.71-1.6-.93-.62-.22-1.27-.33-1.97-.33-.73 0-1.43.12-2.09.35-.66.24-1.24.58-1.73 1-.5.43-.89.96-1.17 1.58-.3.62-.44 1.33-.44 2.12 0 .79.17 1.45.5 1.98.33.53.77.98 1.31 1.35a8.6 8.6 0 0 0 1.89.95c.7.26 1.43.51 2.17.76.87.3 1.75.61 2.63.93a9.8 9.8 0 0 1 2.38 1.24c.7.48 1.27 1.07 1.69 1.75.42.68.63 1.5.63 2.47zm18.54 8.15h-2.69v-7.98h-10.88v-2.28l10.03-18.65h3.54v18.61h3.17v2.33h-3.17v7.97zm-2.69-10.3V12.85l-8.14 15.03v-.71h8.13zm13.41-20.61h2.83l9.24 30.9h-2.81l-3.06-10.3h-9.76l-3.04 10.3h-2.8l9.4-30.9zm5.36 18.3l-4.03-14.3-4.17 14.3h8.2z" fill="#3c4043"></path>
                          <path d="M0 34.36h7.31c1.46 0 2.84-.19 4.11-.55 1.27-.36 2.38-.9 3.33-1.61a7.75 7.75 0 0 0 2.23-2.7c.54-1.06.81-2.3.81-3.7 0-1.48-.3-2.75-.88-3.83a7.78 7.78 0 0 0-2.4-2.67 11.27 11.27 0 0 0-3.56-1.55 16.98 16.98 0 0 0-4.33-.51H0V4.36h7.57c1.58 0 3.08.2 4.48.59 1.4.4 2.65.98 3.74 1.74a8.41 8.41 0 0 1 2.52 2.96c.64 1.19.95 2.58.95 4.17 0 1.27-.23 2.46-.7 3.57a9.33 9.33 0 0 1-1.94 2.93c2.32 1.09 4.08 2.46 5.3 4.12a9.69 9.69 0 0 1 1.82 5.88c0 1.54-.3 2.93-.88 4.17-.6 1.24-1.46 2.3-2.58 3.15a12.4 12.4 0 0 1-4.07 1.98c-1.6.47-3.32.7-5.19.7H0V34.36zm7.26-18.3c1.52 0 2.8.17 3.84.51a7.3 7.3 0 0 1 2.63 1.43c.7.62 1.2 1.33 1.5 2.12.3.8.44 1.66.44 2.6 0 1.07-.2 2.03-.59 2.88-.4.85-.97 1.58-1.72 2.17-.76.6-1.67 1.05-2.75 1.36-1.09.3-2.3.45-3.67.45h-4.3V16.07h4.61zm-.44 15.92c1.43 0 2.72-.17 3.86-.52a8.01 8.01 0 0 0 2.93-1.5c.8-.64 1.41-1.41 1.84-2.33.43-.91.64-1.92.64-3.03 0-2.44-.82-4.22-2.45-5.36-1.64-1.14-3.88-1.7-6.74-1.7h-4.26v14.44h4.18zm92.75 1.28c-1.12 0-2.03-.35-2.74-1.05-.7-.7-1.05-1.56-1.05-2.56 0-1 .35-1.86 1.05-2.56.7-.7 1.62-1.05 2.74-1.05 1.12 0 2.03.35 2.74 1.05.7.7 1.05 1.56 1.05 2.56 0 1-.35 1.85-1.05 2.56-.7.7-1.62 1.05-2.74 1.05zm29.59-13.84a8.7 8.7 0 0 1-2.77 3.05c-1.15.81-2.49 1.41-4 1.8-1.53.4-3.12.59-4.77.59-1.65 0-3.24-.2-4.77-.59a10.73 10.73 0 0 1-4-1.8A8.52 8.52 0 0 1 126 19.43c-.67-1.2-1-2.6-1-4.17 0-1.57.33-2.97 1-4.18.67-1.2 1.57-2.23 2.72-3.04 1.15-.81 2.49-1.42 4-1.8 1.53-.4 3.12-.6 4.77-.6 1.65 0 3.24.2 4.77.6 1.51.38 2.85.99 4 1.8 1.15.81 2.06 1.83 2.72 3.04.67 1.21 1 2.6 1 4.18 0 1.56-.33 2.95-1 4.17zm-2.46-4.17c0-1.26-.25-2.4-.77-3.4a7.51 7.51 0 0 0-2.11-2.57 9.41 9.41 0 0 0-3.18-1.61 13.65 13.65 0 0 0-7.94 0 9.48 9.48 0 0 0-3.18 1.6 7.6 7.6 0 0 0-2.12 2.58c-.51 1-.77 2.14-.77 3.4s.26 2.4.77 3.39a7.6 7.6 0 0 0 2.12 2.58 9.48 9.48 0 0 0 3.18 1.6 13.65 13.65 0 0 0 7.94 0c1.23-.34 2.3-.89 3.18-1.6a7.51 7.51 0 0 0 2.11-2.58c.52-1 .77-2.13.77-3.4zm-10.24 15.02c-1.12 0-2.03-.35-2.74-1.05-.7-.7-1.05-1.56-1.05-2.56 0-1 .35-1.86 1.05-2.56.7-.7 1.62-1.05 2.74-1.05 1.12 0 2.03.35 2.74 1.05.7.7 1.05 1.56 1.05 2.56 0 1-.35 1.85-1.05 2.56-.7.7-1.62 1.05-2.74 1.05zm0 13.99c-1.12 0-2.03-.35-2.74-1.05-.7-.7-1.05-1.56-1.05-2.56 0-1 .35-1.86 1.05-2.56.7-.7 1.62-1.05 2.74-1.05 1.12 0 2.03.35 2.74 1.05.7.7 1.05 1.56 1.05 2.56 0 1-.35 1.85-1.05 2.56-.7.7-1.62 1.05-2.74 1.05zm29.59-13.84c-1.12 0-2.03-.35-2.74-1.05-.7-.7-1.05-1.56-1.05-2.56 0-1 .35-1.86 1.05-2.56.7-.7 1.62-1.05 2.74-1.05 1.12 0 2.03.35 2.74 1.05.7.7 1.05 1.56 1.05 2.56 0 1-.35 1.85-1.05 2.56-.7.7-1.62 1.05-2.74 1.05z" fill="#ea4335"></path>
                        </svg>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-google-blue font-medium">1</span>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">5</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">6</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">7</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">8</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">9</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" className="text-[#4285f4] border-0 hover:underline">10</PaginationLink>
                        </PaginationItem>
                        <PaginationNext href="#" className="border-0 h-auto p-0 hover:bg-transparent hover:text-[#1a0dab]">
                          <span className="text-[#4285f4] hover:underline">Next</span>
                        </PaginationNext>
                      </div>
                    </div>
                  </PaginationContent>
                </Pagination>
              </div>
              
              <div className="flex items-center justify-center my-6 px-4">
                <img src="public/lovable-uploads/6df9cb62-5957-471a-a4cd-03bc0e0fbb49.png" alt="Google Logo" className="h-8" />
              </div>
            </TabsContent>

            <TabsContent value="images" className="m-0">
              <div className="px-4 py-4 grid grid-cols-2 gap-2">
                {visualMatches && visualMatches.map((item: any) => (
                  <div key={item.id} className="rounded-lg overflow-hidden">
                    <div className="bg-gray-50 aspect-square overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs mt-1 line-clamp-2 text-[#202124]">{item.title}</p>
                    <p className="text-[10px] text-[#70757a]">{item.source}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="m-0">
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No videos found</p>
              </div>
            </TabsContent>

            <TabsContent value="news" className="m-0">
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No news found</p>
              </div>
            </TabsContent>

            <TabsContent value="maps" className="m-0">
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>No maps results found</p>
              </div>
            </TabsContent>

            <TabsContent value="shopping" className="m-0">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Shopping results</h2>
                {shoppingResults && shoppingResults.length > 0 ? (
                  <div className="space-y-4">
                    {shoppingResults.map((item: any) => (
                      <div key={item.id} className="flex border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-50">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                          <p className="text-base font-bold text-[#202124]">{item.price}</p>
                          <p className="text-xs text-[#70757a]">{item.store}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No shopping results found</p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white pt-2 pb-1 px-6 border-t flex justify-around z-10">
          <div className="flex flex-col items-center text-google-blue">
            <Search className="w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </div>
          <div className="flex flex-col items-center text-[#5f6368]">
            <Camera className="w-5 h-5" />
            <span className="text-xs mt-1">Lens</span>
          </div>
          <div className="flex flex-col items-center text-[#5f6368]">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs mt-1">More</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ResultsPage;

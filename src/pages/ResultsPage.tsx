
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { ArrowLeft, Camera, Search, Info, ShoppingBag, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSearchResults, fetchImageSearchResults, SearchResponse } from "@/api/searchApi";
import { useQuery } from "@tanstack/react-query";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { searchTerm, searchImage } = useSearch();
  const [currentTab, setCurrentTab] = useState("all");

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center space-x-3 border-b sticky top-0 bg-white z-10">
        <button onClick={() => navigate('/search')} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-google-dark-gray" />
        </button>
        
        <div 
          className="flex-1 bg-google-gray rounded-full px-4 py-2 flex items-center"
          onClick={() => navigate('/search')}
        >
          {searchTerm || "Search with image"}
        </div>
        
        <button className="flex-shrink-0">
          <Camera className="w-5 h-5 text-google-dark-gray" />
        </button>
      </header>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="sticky top-[65px] bg-white z-10">
          <TabsList className="p-0 bg-transparent border-b w-full justify-start px-2">
            <TabsTrigger value="all" className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-google-blue rounded-none data-[state=active]:shadow-none text-sm font-medium">All</TabsTrigger>
            <TabsTrigger value="visual" className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-google-blue rounded-none data-[state=active]:shadow-none text-sm font-medium">Visual matches</TabsTrigger>
            <TabsTrigger value="shop" className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-google-blue rounded-none data-[state=active]:shadow-none text-sm font-medium">Shopping</TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content */}
        <div className="px-4 py-3 overflow-y-auto pb-20">
          <TabsContent value="all" className="m-0">
            {/* Uploaded Image */}
            {searchImage.preview && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Your image</p>
                <div className="max-w-[150px] h-auto rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={searchImage.preview} 
                    alt="Uploaded search" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* What is this object section */}
            {searchResults && searchResults[0] && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">{searchResults[0].title}</h2>
                <p className="text-lg mb-2">{results.answer || searchResults[0].description}</p>
                <p className="text-gray-600">{results.additionalInfo || ''}</p>
                
                <Button 
                  variant="outline" 
                  className="mt-3 text-google-blue border-google-blue"
                >
                  <Info size={16} className="mr-1" /> 
                  Learn more
                </Button>
              </div>
            )}

            {/* Visual Matches */}
            {visualMatches && visualMatches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Visual matches</h3>
                <div className="grid grid-cols-3 gap-3">
                  {visualMatches.map((item: any) => (
                    <div key={item.id} className="rounded-lg overflow-hidden">
                      <div className="bg-gray-100 h-32 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.source}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-3 text-google-blue w-full">
                  View more
                </Button>
              </div>
            )}

            {/* Shopping Results */}
            {shoppingResults && shoppingResults.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Shopping</h3>
                  <ShoppingBag size={18} className="text-google-dark-gray" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {shoppingResults.map((item: any) => (
                    <div key={item.id} className="rounded-lg overflow-hidden">
                      <div className="h-24 bg-gray-100 mb-1 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm line-clamp-1">{item.title}</p>
                      <p className="text-sm font-medium">{item.price}</p>
                      <p className="text-xs text-gray-500">{item.store}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-3 text-google-blue w-full">
                  View more shopping results
                </Button>
              </div>
            )}

            {/* Related Searches */}
            {results.relatedSearches && results.relatedSearches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Related searches</h3>
                <div className="flex flex-wrap gap-2">
                  {results.relatedSearches.map((item: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-google-gray rounded-full px-4 py-2 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visual" className="m-0">
            <h2 className="text-lg font-medium mb-4">Visual matches</h2>
            {visualMatches && visualMatches.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {visualMatches.map((item: any) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-36 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No visual matches found</p>
            )}
          </TabsContent>

          <TabsContent value="shop" className="m-0">
            <h2 className="text-lg font-medium mb-4">Shopping</h2>
            {shoppingResults && shoppingResults.length > 0 ? (
              <div className="space-y-4">
                {shoppingResults.map((item: any) => (
                  <div key={item.id} className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-lg font-bold text-google-dark-gray">{item.price}</p>
                      <p className="text-sm text-gray-500">{item.store}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No shopping results found</p>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-around">
        <div className="flex flex-col items-center text-google-blue">
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <Camera className="w-5 h-5" />
          <span className="text-xs mt-1">Lens</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-xs mt-1">More</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

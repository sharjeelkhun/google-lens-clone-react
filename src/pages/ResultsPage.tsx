
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { Search, Mic, Camera, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/api/searchApi";
import { motion } from "framer-motion";
import { ResultsLayout } from "@/components/layout/ResultsLayout";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchResults", searchTerm, activeTab],
    queryFn: () => fetchSearchResults({ query: searchTerm, type: activeTab === 'images' ? 'image' : 'web' }),
    enabled: !!searchTerm,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Refresh search results
    }
  };

  // Calculate pagination
  const totalPages = searchResults?.searchResults ? Math.ceil(searchResults.searchResults.length / resultsPerPage) : 0;
  const paginatedResults = searchResults?.searchResults
    ? searchResults.searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
    : [];

  // Header Content
  const headerContent = (
    <div className="container-custom">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="h-8 w-8 flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center">
            <span className="text-2xl font-medium text-google-blue">G</span>
            <span className="text-2xl font-medium text-google-red">o</span>
            <span className="text-2xl font-medium text-google-yellow">o</span>
            <span className="text-2xl font-medium text-google-blue">g</span>
            <span className="text-2xl font-medium text-google-green">l</span>
            <span className="text-2xl font-medium text-google-red">e</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Grid className="h-5 w-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            U
          </div>
        </div>
      </div>
      
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mt-2 mb-3">
        <div className="search-bar-container">
          <Search className="text-gray-400 w-4 h-4 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Google"
            className="flex-1 bg-transparent"
          />
          <div className="flex items-center space-x-3">
            <button type="button" className="hover:bg-gray-100 p-2 rounded-full">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
            <button type="button" className="hover:bg-gray-100 p-2 rounded-full">
              <Camera className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </form>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto mb-2 pb-2 w-full overflow-x-auto flex justify-start space-x-4">
          <TabsTrigger 
            value="all" 
            className="text-sm px-1 py-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="images" 
            className="text-sm px-1 py-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Images
          </TabsTrigger>
          <TabsTrigger 
            value="videos" 
            className="text-sm px-1 py-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="news" 
            className="text-sm px-1 py-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            News
          </TabsTrigger>
          <TabsTrigger 
            value="maps" 
            className="text-sm px-1 py-0 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Maps
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="border-b border-gray-200"></div>
      </Tabs>
    </div>
  );

  // Main Content
  const mainContent = (
    <div>
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="all" className="m-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{result.domain}</span>
                  </div>
                  <h3 className="text-lg font-medium text-google-link group-hover:underline mt-1">
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {result.description}
                  </p>
                </motion.div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center pt-4 pb-8 space-x-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="images" className="m-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-google-blue"></div>
              </div>
            ) : (
              searchResults?.visualMatches?.slice(0, 12).map((result) => (
                <motion.div
                  key={result.imageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="group aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={result.imageUrl || 'https://placehold.co/300x300/e9ecef/495057?text=Image'}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="m-0">
          <div className="py-4">
            <p className="text-center text-gray-500">Video results for "{searchTerm}"</p>
          </div>
        </TabsContent>
        
        <TabsContent value="news" className="m-0">
          <div className="py-4">
            <p className="text-center text-gray-500">News results for "{searchTerm}"</p>
          </div>
        </TabsContent>
        
        <TabsContent value="maps" className="m-0">
          <div className="py-4">
            <p className="text-center text-gray-500">Map results for "{searchTerm}"</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Footer Content
  const footerContent = (
    <div className="mt-8 py-4 border-t border-gray-200 text-sm text-gray-500 text-center">
      <p>© 2025 - Google Search Clone</p>
    </div>
  );

  return <ResultsLayout header={headerContent} content={mainContent} footer={footerContent} />;
};

export default ResultsPage;

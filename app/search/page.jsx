"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ArrowLeft, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Movie card component for search results
function MovieCard({ movie }) {
  if (!movie) return null;
  
  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:scale-105 hover:shadow-lg">
        <div className="aspect-[2/3] relative">
          {movie.posterUrl ? (
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">{movie.year || "Unknown"} • {movie.type === "tv" ? "TV Show" : "Movie"}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

// Loading skeleton for movie cards
function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="aspect-[2/3] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get the query and filters from URL params
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    const urlGenre = searchParams.get("genre") || "all";
    const urlYear = searchParams.get("year") || "all";
    
    setQuery(urlQuery);
    setGenre(urlGenre);
    setYear(urlYear);
    
    // Only search if we have at least one filter
    if (urlQuery || urlGenre !== "all" || urlYear !== "all") {
      searchMovies(urlQuery, urlGenre, urlYear, 1);
    }
  }, [searchParams]);
  
  // Function to search movies with filters
  const searchMovies = async (searchQuery, genreFilter, yearFilter, pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the query URL with all filters
      const params = new URLSearchParams();
      
      if (searchQuery?.trim()) {
        params.set("query", searchQuery.trim());
      }
      
      if (genreFilter && genreFilter !== "all") {
        params.set("genre", genreFilter);
      }
      
      if (yearFilter && yearFilter !== "all") {
        params.set("year", yearFilter);
      }
      
      params.set("page", pageNum.toString());
      
      const response = await fetch(`/api/movies/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter results client-side based on genre and year if needed
      let filteredResults = data.results || [];
      
      // Apply additional client-side filtering if needed
      if (genreFilter && genreFilter !== "all") {
        filteredResults = filteredResults.filter(movie => 
          movie.genres && movie.genres.some(g => 
            g.toLowerCase().includes(genreFilter.toLowerCase())
          )
        );
      }
      
      if (yearFilter && yearFilter !== "all") {
        filteredResults = filteredResults.filter(movie => {
          const movieYear = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null);
          if (!movieYear) return false;
          
          // Handle decade ranges
          if (yearFilter === "2010s") return movieYear >= 2010 && movieYear <= 2019;
          if (yearFilter === "2000s") return movieYear >= 2000 && movieYear <= 2009;
          if (yearFilter === "1990s") return movieYear >= 1990 && movieYear <= 1999;
          if (yearFilter === "older") return movieYear < 1990;
          
          // Handle specific years
          return movieYear.toString() === yearFilter;
        });
      }
      
      setResults(filteredResults);
      setTotalPages(data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e?.preventDefault();
    
    // Update URL with current filters
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.set("query", query.trim());
    }
    
    if (genre !== "all") {
      params.set("genre", genre);
    }
    
    if (year !== "all") {
      params.set("year", year);
    }
    
    // Update the URL without reloading the page
    const queryString = params.toString();
    if (queryString) {
      router.push(`/search?${queryString}`);
    }
    
    // Perform the search
    searchMovies(query, genre, year, 1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      searchMovies(query, genre, year, newPage);
      window.scrollTo(0, 0);
    }
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search by title..."
              className="pl-12 py-6 text-lg rounded-full border-2 focus:border-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          <div className="flex items-center mb-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={toggleFilters}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          
          {showFilters && (
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Select value={genre} onValueChange={(value) => { setGenre(value); }}>
                <SelectTrigger className="w-full md:w-48 rounded-full">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={year} onValueChange={(value) => { setYear(value); }}>
                <SelectTrigger className="w-full md:w-48 rounded-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2010s">2010-2019</SelectItem>
                  <SelectItem value="2000s">2000-2009</SelectItem>
                  <SelectItem value="1990s">1990-1999</SelectItem>
                  <SelectItem value="older">Before 1990</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                type="button"
                onClick={() => handleSearch()}
                className="rounded-full px-8"
              >
                Apply Filters
              </Button>
            </div>
          )}
        </form>
      </div>
      
      {/* Results */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="p-4 mb-6 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <>
            <p className="mb-4 text-muted-foreground">Loading results...</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : results.length > 0 ? (
          <>
            <p className="mb-4 text-muted-foreground">
              Found {results.length} results for "{query}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="mx-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No results found for "{query}"</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

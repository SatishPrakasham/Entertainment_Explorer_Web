"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import { TrendingBooks, PopularBooks } from "@/components/book-list";

export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize state from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    const urlYear = searchParams.get("year") || "all";
    
    setSearchQuery(urlQuery);
    setYear(urlYear);
    
    // If there are search params, we're in search mode
    setIsSearching(!!(urlQuery || urlYear !== "all"));
  }, [searchParams]);
  
  // Handle search and filter submission
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.set("query", searchQuery.trim());
      }
      
      if (year !== "all") {
        params.set("year", year);
      }
      
      // Navigate to search results
      const queryString = params.toString();
      if (queryString) {
        router.push(`/search?${queryString}`);
      } else {
        router.push("/books");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Books</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className="flex items-center space-x-2">
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {[...Array(10)].map((_, i) => (
                <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                  {(new Date().getFullYear() - i).toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {isSearching ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <p className="text-muted-foreground">Showing results for "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <TrendingBooks />
          <PopularBooks />
        </>
      )}
    </div>
  );
}

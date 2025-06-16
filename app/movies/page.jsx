"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play } from "lucide-react"
import Link from "next/link"
import { TrendingMovies, PopularMovies } from "@/components/movie-list"

// Movie data is now fetched from the API in the components

export default function MoviesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for search and year filter
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  
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
  const handleSearch = () => {
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
      // If no filters, stay on movies page
      router.push("/movies");
    }
  };
  
  // Handle key press for search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Explore Movies</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search movie titles..." 
                className="pl-12 py-3 rounded-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Select value={year} onValueChange={setYear}>
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
              className="rounded-full px-8" 
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Trending Movies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <TrendingMovies />
        </section>

        {/* Popular Movies */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Movies</h2>
          <PopularMovies />
        </section>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Entertainment Explorer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover the best in movies, books, and music all in one place.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link
                  href="/movies"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/books"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Books
                </Link>
                <Link
                  href="/music"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Music
                </Link>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h3 className="font-semibold">Account</h3>
              <div className="space-y-2">
                <Link
                  href="/signin"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/my-list"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My List
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 Entertainment Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

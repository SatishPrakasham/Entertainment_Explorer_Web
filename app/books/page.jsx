"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTrendingBooks, getClassicBooks} from "@/lib/openLibraryApi"; // Import functions to fetch books and authors
import { BookList } from "@/components/book-grid"; // Import the combined BookCard and BookList (now called BookList)
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea and ScrollBar components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components for filters
import { Play } from "lucide-react"; 
import Link from "next/link";

export default function BooksPage() {
  const [trending, setTrending] = useState([]);
  const [classics, setClassics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const genres = [
    { id: "all", name: "All" },
    { id: "fiction", name: "Fiction" },
    { id: "non-fiction", name: "Non-Fiction" },
    { id: "mystery", name: "Mystery" },
    { id: "thriller", name: "Thriller" },
    { id: "sci-fi", name: "Sci-Fi" },
    { id: "fantasy", name: "Fantasy" },
    { id: "romance", name: "Romance" },
    { id: "horror", name: "Horror" },
    { id: "adventure", name: "Adventure" },
  ];

  useEffect(() => {
    const loadBooks = async () => {
      const trendingData = await getTrendingBooks();
      const classicData = await getClassicBooks();
      setTrending(trendingData);
      setClassics(classicData);
      applyFilters(trendingData, classicData);
    };
  
    loadBooks();
  }, []); // Empty dependency array

  // Update filtered books when genre changes
useEffect(() => {
    applyFilters(trending, classics);
  }, [genre, trending, classics]);
  
  // Update filtered books when year changes
  useEffect(() => {
    applyFilters(trending, classics);
  }, [year, trending, classics]);

  const filterBooks = (books) => {
    let filtered = [...books];

    // Apply genre filter
    if (genre !== "all") {
      filtered = filtered.filter(book => book.genre === genre);
    }

    // Apply year filter
    if (year !== "all") {
      filtered = filtered.filter(book => {
        const bookYear = book.firstPublishYear || 0;
        if (year === "2010s") return bookYear >= 2010 && bookYear <= 2019;
        if (year === "2000s") return bookYear >= 2000 && bookYear <= 2009;
        if (year === "1990s") return bookYear >= 1990 && bookYear <= 1999;
        if (year === "older") return bookYear < 1990;
        return bookYear.toString() === year;
      });
    }

    // Apply search query if it exists
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        book => book.title.toLowerCase().includes(q) || 
               (book.author && book.author.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  const handleSearch = () => {
    const allBooks = [...trending, ...classics];
    const results = filterBooks(allBooks);
    setFilteredBooks(results);
  };

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
    setSelectedGenre(selectedGenre);
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  // Function to apply filters
  const applyFilters = (trendingData, classicData) => {
    const allBooks = [...trendingData, ...classicData];
    const filtered = filterBooks(allBooks);
    setFilteredBooks(filtered);
  };
  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Explore Books</h1>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search book titles or authors..."
              className="pl-12 py-3 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select value={year} onValueChange={handleYearChange}>
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
          <Button className="rounded-full px-8" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* Genre Filter (Horizontal List) */}
      <div className="mb-8">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 p-1">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={genre.id === selectedGenre ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => handleGenreChange(genre.id)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Search Results */}
      {searchQuery ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          {filteredBooks.length > 0 ? (
            <BookList books={filteredBooks} />
          ) : (
            <p className="text-muted-foreground">No books found for "{searchQuery}".</p>
          )}
        </section>
      ) : (
        <>
          {/* Trending Books */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Trending Books</h2>
            <BookList books={filteredBooks.length > 0 ? filteredBooks.filter(b => trending.some(t => t.id === b.id)) : trending} isHorizontal={true} />
          </section>

          {/* Classic Books */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Classic Books</h2>
            <BookList books={filteredBooks.length > 0 ? filteredBooks.filter(b => classics.some(c => c.id === b.id)) : classics} />
          </section>
        </>
      )}

      {/* Footer */}
      <div className="border-t w-full mt-16"></div>
      <footer className="bg-card border-t mt-0">
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
            <p className="text-sm text-muted-foreground">&copy; 2024 Entertainment Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

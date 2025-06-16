'use client'; // Mark the file as a client component

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

function BookCard({ book, isHorizontal = false }) {
  return (
    <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <Image
            src={book.coverUrl || "/placeholder.svg"}
            alt={book.title}
            width={200}
            height={300}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {book.year || "Unknown year"} • {book.genre || "Unknown genre"}
          </span>
          <Button size="sm" variant="outline" className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            Add to My List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get("https://openlibrary.org/search.json", {
        params: {
          q: searchQuery || "bestsellers",
          subject: genre !== "all" ? genre : undefined,
          limit: 10,
        },
      });

      const fetchedBooks = response.data.docs.map((book) => ({
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown Author",
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : "/placeholder.svg",
        year: book.first_publish_year || "Unknown Year",
        description: book.first_sentence
          ? book.first_sentence.join(" ")
          : "No description available",
        genre: genre !== "all" ? genre : "General",
      }));

      setBooks(fetchedBooks);
    };
    fetchBooks();
  }, [searchQuery, genre]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Explore Books</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search book titles..."
                className="pl-12 py-3 rounded-full"
              />
            </div>
            <Select onValueChange={setGenre}>
              <SelectTrigger className="w-full md:w-48 rounded-full">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setYear}>
              <SelectTrigger className="w-full md:w-48 rounded-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trending Books */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Books</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {books.map((book) => (
              <BookCard key={book.title} book={book} isHorizontal={true} />
            ))}
          </div>
        </section>

        {/* Book Results */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Book Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

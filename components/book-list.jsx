"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function BookCard({ book, isHorizontal = false }) {
  const imageUrl = book.coverUrl || "/placeholder.svg?height=300&width=200";
  const year = book.firstPublishYear || "Unknown";
  const genres = book.subjects?.[0] || "Fiction";

  return (
    <Link href={`/books/${book.id}`} className="block">
      <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
        <CardContent className="p-4">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <Image
              src={imageUrl}
              alt={book.title || "Book cover"}
              width={200}
              height={300}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" className="rounded-full" onClick={(e) => {
                e.preventDefault();
                // Add to list functionality would go here
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add to List
              </Button>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {year} • {genres}
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Add to list functionality would go here
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function TrendingBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await fetch('/api/books/trending');
        if (!response.ok) {
          throw new Error('Failed to fetch trending books');
        }
        const data = await response.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching trending books:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="h-64">
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="h-4 bg-gray-200 rounded mb-2"></h3>
                <p className="h-6 bg-gray-200 rounded mb-3"></p>
                <div className="flex justify-between items-center">
                  <span className="h-4 bg-gray-200 rounded w-24"></span>
                  <Button variant="outline" className="rounded-full">
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!books.length) {
    return <div className="text-center py-8">No trending books found</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trending Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export function PopularBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await fetch('/api/books?popular=true');
        const data = await response.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching popular books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="h-64">
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="h-4 bg-gray-200 rounded mb-2"></h3>
                <p className="h-6 bg-gray-200 rounded mb-3"></p>
                <div className="flex justify-between items-center">
                  <span className="h-4 bg-gray-200 rounded w-24"></span>
                  <Button variant="outline" className="rounded-full">
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Popular Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export function BookList({ books }) {
  // Transform books data to match the expected format for BookCard
  const transformedBooks = books.map(book => ({
    ...book,
    imageUrl: book.coverUrl,
    _id: book.id,
    type: book.genre
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {transformedBooks.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}

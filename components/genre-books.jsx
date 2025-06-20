"use client";

import React, { useState, useEffect } from "react";
import { BookList } from "@/components/book-card"; // Assuming you have this component
import { getBooksByGenre } from "@/lib/openLibraryApi"; // Replace with correct API function for genre-based fetching

export function GenreBooks({ selectedGenreId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooksByGenre = async () => {
      setLoading(true);
      const booksData = await getBooksByGenre(selectedGenreId); // Make sure to fetch books based on genre
      setBooks(booksData);
      setLoading(false);
    };
    
    loadBooksByGenre();
  }, [selectedGenreId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{selectedGenreId} Books</h2>
      <BookList books={books} />
    </div>
  );
}

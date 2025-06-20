"use client";

import React from "react";
import { BookCard } from "./book-card"; // Reuse the BookCard component for rendering books in a grid layout

// BookList: Render a list of books using BookCard
export function BookList({ books, isHorizontal = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} isHorizontal={isHorizontal} />
      ))}
    </div>
  );
}

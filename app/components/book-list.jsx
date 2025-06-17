'use client';

import React from 'react';
import { BookCard } from './book-card';

export function BookList({ books = [], isHorizontal = false }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No books available.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${isHorizontal ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

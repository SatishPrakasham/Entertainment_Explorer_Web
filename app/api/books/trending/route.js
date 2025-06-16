import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Fetch trending books from Open Library
    const response = await fetch('https://openlibrary.org/search.json?q=bestsellers&sort=rating&limit=8', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending books');
    }
    
    const data = await response.json();
    
    // Format the books data
    const formattedBooks = data.docs.slice(0, 8).map(book => ({
      id: book.key?.replace('/works/', '') || Math.random().toString(36).substring(2, 15),
      title: book.title || 'Unknown Title',
      description: book.first_sentence?.[0] || book.subtitle || 'No description available',
      author: book.author_name?.[0] || 'Unknown Author',
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "/placeholder.svg",
      year: book.first_publish_year || 'Unknown Year',
      genre: book.subject?.[0] || 'Fiction'
    }));
    
    return NextResponse.json({
      results: formattedBooks,
      total: formattedBooks.length
    });
  } catch (error) {
    console.error('Error in trending books API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch trending books',
      results: [],
      total: 0
    }, { status: 500 });
  }
}

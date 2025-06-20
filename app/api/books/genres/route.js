import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const genres = [
      { id: 'all', name: 'All Genres' },
      { id: 'fiction', name: 'Fiction' },
      { id: 'nonfiction', name: 'Non-Fiction' },
      { id: 'mystery', name: 'Mystery' },
      { id: 'romance', name: 'Romance' },
      { id: 'science-fiction', name: 'Science Fiction' },
      { id: 'fantasy', name: 'Fantasy' },
      { id: 'biography', name: 'Biography' },
      { id: 'history', name: 'History' },
      { id: 'self-help', name: 'Self-Help' },
      { id: 'business', name: 'Business' },
      { id: 'education', name: 'Education' },
      { id: 'religion', name: 'Religion' },
      { id: 'art', name: 'Art' },
      { id: 'travel', name: 'Travel' },
      { id: 'food', name: 'Food & Cooking' },
      { id: 'health', name: 'Health & Wellness' },
      { id: 'sports', name: 'Sports' },
      { id: 'technology', name: 'Technology' },
      { id: 'politics', name: 'Politics' }
    ];

    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Error fetching book genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book genres', details: error.message },
      { status: 500 }
    );
  }
}

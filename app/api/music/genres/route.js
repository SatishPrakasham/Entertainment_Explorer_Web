import { getGenres } from '@/lib/deezer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const genres = await getGenres();
    
    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Error in genres API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music genres', genres: [] },
      { status: 500 }
    );
  }
}

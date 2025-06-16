import { getTracksByGenre } from '@/lib/deezer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genreId = parseInt(searchParams.get('id') || '132'); // Default to Pop (132)
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const tracks = await getTracksByGenre(genreId, limit);
    
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error in genre API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genre tracks' },
      { status: 500 }
    );
  }
}

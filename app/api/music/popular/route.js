import { getPopularAlbums } from "@/lib/deezer";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const albums = await getPopularAlbums(limit);
    
    return NextResponse.json({
      results: albums,
      total: albums.length
    });
  } catch (error) {
    console.error('Error in popular albums API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch popular albums',
      results: [],
      total: 0
    }, { status: 500 });
  }
}

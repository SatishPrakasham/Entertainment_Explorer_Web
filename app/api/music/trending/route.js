import { getTrendingTracks } from "@/lib/deezer";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const tracks = await getTrendingTracks(limit);
    
    return NextResponse.json({
      results: tracks,
      total: tracks.length
    });
  } catch (error) {
    console.error('Error in trending tracks API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch trending tracks',
      results: [],
      total: 0
    }, { status: 500 });
  }
}

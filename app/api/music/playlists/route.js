import { getPopularPlaylists } from '@/lib/deezer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const playlists = await getPopularPlaylists(limit);
    
    return NextResponse.json({ playlists });
  } catch (error) {
    console.error('Error in playlists API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular playlists' },
      { status: 500 }
    );
  }
}

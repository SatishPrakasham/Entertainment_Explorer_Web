import { getNewReleases } from '@/lib/deezer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const albums = await getNewReleases(limit);
    
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error in new-releases API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new releases' },
      { status: 500 }
    );
  }
}

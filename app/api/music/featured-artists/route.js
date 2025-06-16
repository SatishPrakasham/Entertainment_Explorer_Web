import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    // Using Deezer chart artists as featured artists
    const response = await fetch(`https://api.deezer.com/chart/0/artists?limit=${limit}`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured artists');
    }
    
    const data = await response.json();
    
    // Format artist data to ensure all required properties exist
    const formattedArtists = Array.isArray(data.data) ? data.data.map(artist => ({
      id: artist.id,
      name: artist.name || 'Unknown Artist',
      picture_medium: artist.picture_medium || artist.picture || null,
      nb_fan: artist.nb_fan || 0
    })) : [];
    
    return NextResponse.json({
      results: formattedArtists,
      total: data.total || formattedArtists.length || 0
    });
  } catch (error) {
    console.error('Error in featured artists API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch featured artists',
      results: [],
      total: 0
    }, { status: 500 });
  }
}

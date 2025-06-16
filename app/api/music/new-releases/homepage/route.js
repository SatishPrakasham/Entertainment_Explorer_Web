import { getNewReleases } from '@/lib/deezer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get limit from query params or default to 8 for homepage display
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    
    // Fetch new releases from Deezer API
    const albums = await getNewReleases(limit);
    
    // Format the albums for consistent display on homepage
    const formattedAlbums = albums.map(album => ({
      id: album.id,
      title: album.title || 'Unknown Album',
      description: `${album.artist?.name || 'Unknown Artist'} • ${album.nb_tracks || 0} tracks`,
      coverUrl: album.cover_medium || album.cover || '/placeholder.svg',
      image: album.cover_medium || album.cover || '/placeholder.svg', // For compatibility with homepage component
      year: album.release_date ? album.release_date.substring(0, 4) : 'New'
    }));
    
    return NextResponse.json({
      results: formattedAlbums,
      total: formattedAlbums.length
    });
  } catch (error) {
    console.error('Error in new-releases homepage API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch new releases',
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

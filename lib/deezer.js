/**
 * Deezer API helper functions
 * Documentation: https://developers.deezer.com/api
 * 
 * Enhanced with additional functions for new releases, genres, and recommendations
 */

/**
 * Search for tracks, albums, artists, or playlists
 * @param {string} query - Search query
 * @param {string} type - Type of search (track, album, artist, playlist)
 * @param {number} limit - Number of results to return
 * @param {number} index - Starting index for pagination
 */
export async function searchMusic(query, type = 'track', limit = 20, index = 0) {
  try {
    const response = await fetch(
      `https://api.deezer.com/search/${type}?q=${encodeURIComponent(query)}&limit=${limit}&index=${index}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      results: data.data || [],
      total: data.total || 0,
      nextPage: data.next ? index + limit : null,
      prevPage: index > 0 ? Math.max(0, index - limit) : null
    };
  } catch (error) {
    console.error('Error searching music:', error);
    return { results: [], total: 0, nextPage: null, prevPage: null };
  }
}

/**
 * Get trending tracks
 * @param {number} limit - Number of results to return
 */
export async function getTrendingTracks(limit = 20) {
  try {
    // Deezer doesn't have a direct trending endpoint, so we use the charts
    const response = await fetch(
      `https://api.deezer.com/chart/0/tracks?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      results: data.data || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return { results: [], total: 0 };
  }
}

/**
 * Get popular albums
 * @param {number} limit - Number of results to return
 */
export async function getPopularAlbums(limit = 20) {
  try {
    // Use the charts endpoint for albums
    const response = await fetch(
      `https://api.deezer.com/chart/0/albums?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      results: data.data || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching popular albums:', error);
    return { results: [], total: 0 };
  }
}

/**
 * Get track details by ID
 * @param {string} id - Track ID
 */
export async function getTrackById(id) {
  try {
    const response = await fetch(
      `https://api.deezer.com/track/${id}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching track ${id}:`, error);
    return null;
  }
}

/**
 * Get album details by ID
 * @param {string} id - Album ID
 */
export async function getAlbumById(id) {
  try {
    const response = await fetch(
      `https://api.deezer.com/album/${id}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching album ${id}:`, error);
    return null;
  }
}

/**
 * Get artist details by ID
 * @param {string} id - Artist ID
 */
export async function getArtistById(id) {
  try {
    const response = await fetch(
      `https://api.deezer.com/artist/${id}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching artist ${id}:`, error);
    return null;
  }
}

/**
 * Get artist's top tracks
 * @param {string} id - Artist ID
 * @param {number} limit - Number of results to return
 */
export async function getArtistTopTracks(id, limit = 10) {
  try {
    const response = await fetch(
      `https://api.deezer.com/artist/${id}/top?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching top tracks for artist ${id}:`, error);
    return [];
  }
}

/**
 * Format track data for consistent use in the UI
 * @param {Object} track - Track data from Deezer API
 */
export function formatTrackData(track) {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist?.name || 'Unknown Artist',
    artistId: track.artist?.id,
    album: track.album?.title || 'Unknown Album',
    albumId: track.album?.id,
    coverUrl: track.album?.cover_medium || track.album?.cover || '',
    duration: track.duration, // in seconds
    preview: track.preview || '',
    releaseDate: track.release_date || '',
    explicit: track.explicit_lyrics || false
  };
}

/**
 * Format album data for consistent use in the UI
 * @param {Object} album - Album data from Deezer API
 */
export function formatAlbumData(album) {
  return {
    id: album.id,
    title: album.title,
    cover: album.cover_big || album.cover_xl || album.cover_medium || album.cover,
    artist: album.artist ? {
      id: album.artist.id,
      name: album.artist.name
    } : null,
    tracksCount: album.nb_tracks || 0,
    releaseDate: album.release_date,
    link: album.link,
    type: 'album'
  };
}

/**
 * Get new releases (recently released albums)
 * @param {number} limit - Number of results to return
 */
export async function getNewReleases(limit = 20) {
  try {
    // First get editorial selection which often has new releases
    const response = await fetch(
      `https://api.deezer.com/editorial/0/releases?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    const albums = data.data || [];
    
    return albums.map(formatAlbumData);
  } catch (error) {
    console.error('Error getting new releases:', error);
    
    // Fallback to search for recent albums if editorial endpoint fails
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(
        `https://api.deezer.com/search/album?q=year:"${currentYear}"&limit=${limit}&order=RANKING`,
        { next: { revalidate: 3600 } }
      );
      
      if (!response.ok) {
        throw new Error(`Deezer API error: ${response.status}`);
      }
      
      const data = await response.json();
      return (data.data || []).map(formatAlbumData);
    } catch (fallbackError) {
      console.error('Error with fallback for new releases:', fallbackError);
      return [];
    }
  }
}

/**
 * Get tracks by genre
 * @param {number} genreId - Genre ID (91=Jazz, 132=Pop, 116=Rap, 152=Rock, 113=Dance)
 * @param {number} limit - Number of results to return
 */
export async function getTracksByGenre(genreId = 132, limit = 20) {
  try {
    // First try to get tracks from genre radio
    const response = await fetch(
      `https://api.deezer.com/radio/${genreId}/tracks?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    const tracks = data.data || [];
    
    return tracks.map(formatTrackData);
  } catch (error) {
    console.error(`Error getting tracks for genre ${genreId}:`, error);
    return [];
  }
}

/**
 * Get popular playlists
 * @param {number} limit - Number of results to return
 */
export async function getPopularPlaylists(limit = 10) {
  try {
    const response = await fetch(
      `https://api.deezer.com/chart/0/playlists?limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    const playlists = data.data || [];
    
    return playlists.map(playlist => ({
      id: playlist.id,
      title: playlist.title,
      cover: playlist.picture_big || playlist.picture_xl || playlist.picture_medium,
      tracksCount: playlist.nb_tracks || 0,
      user: playlist.user ? playlist.user.name : 'Deezer',
      link: playlist.link,
      type: 'playlist'
    }));
  } catch (error) {
    console.error('Error getting popular playlists:', error);
    return [];
  }
}

/**
 * Get genre list
 */
export async function getGenres() {
  try {
    const response = await fetch(
      'https://api.deezer.com/genre',
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting genres:', error);
    return [];
  }
}

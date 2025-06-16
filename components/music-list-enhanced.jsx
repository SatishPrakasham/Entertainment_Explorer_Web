'use client';

import React, { useState, useEffect } from "react";
import { TrackCard, AlbumCard } from "@/components/music-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton for music cards
function MusicCardSkeleton({ count = 4 }) {
  return Array(count).fill(0).map((_, i) => (
    <Card key={i} className="flex-shrink-0 w-64">
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 rounded-lg mb-4" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ));
}

export function TrendingTracks({ limit = 8 }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrendingTracks() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/trending?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending tracks');
        }
        
        const data = await response.json();
        // Ensure tracks is always an array
        setTracks(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTrendingTracks();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        <MusicCardSkeleton count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No trending tracks available right now.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {tracks.map(track => (
        <div key={track.id} className="flex-shrink-0">
          <TrackCard track={track} />
        </div>
      ))}
    </div>
  );
}

export function PopularAlbums({ limit = 8 }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPopularAlbums() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/popular?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular albums');
        }
        
        const data = await response.json();
        // Ensure albums is always an array
        setAlbums(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error('Error fetching popular albums:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPopularAlbums();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        <MusicCardSkeleton count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No popular albums available right now.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {albums.map(album => (
        <div key={album.id} className="flex-shrink-0">
          <AlbumCard album={album} />
        </div>
      ))}
    </div>
  );
}

export function MusicSearchResults({ query, type = 'track', page = 1 }) {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (query) {
      fetchSearchResults();
    }
  }, [query, type, page]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MusicCardSkeleton count={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No {type}s found for "{query}".</p>
        <p>Try a different search term or content type.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {type === 'track' && results.map(track => (
        <TrackCard key={track.id} track={track} />
      ))}
      {type === 'album' && results.map(album => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}

export function NewReleases({ limit = 8 }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/new-releases?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch new releases');
        }
        
        const data = await response.json();
        // Make sure albums is an array and each album has the expected properties
        const formattedAlbums = Array.isArray(data.albums) ? data.albums.map(album => ({
          id: album.id,
          title: album.title || 'Unknown Album',
          artist: album.artist?.name || 'Unknown Artist',
          coverUrl: album.cover_medium || album.cover || '/placeholder.svg',
          trackCount: album.nb_tracks || 0
        })) : [];
        setAlbums(formattedAlbums);
      } catch (error) {
        console.error('Error fetching new releases:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNewReleases();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        <MusicCardSkeleton count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No new releases available right now.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {albums.map(album => (
        <div key={album.id} className="flex-shrink-0">
          <AlbumCard album={album} />
        </div>
      ))}
    </div>
  );
}

export function GenreTracks({ genreId = 132, genreName = "Pop", limit = 8 }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGenreTracks() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/genre?id=${genreId}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${genreName} tracks`);
        }
        
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (error) {
        console.error(`Error fetching ${genreName} tracks:`, error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGenreTracks();
  }, [genreId, genreName, limit]);

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        <MusicCardSkeleton count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No {genreName} tracks available right now.</p>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {tracks.map(track => (
        <div key={track.id} className="flex-shrink-0">
          <TrackCard track={track} />
        </div>
      ))}
    </div>
  );
}

export function PopularPlaylists({ limit = 6 }) {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/music/playlists?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular playlists');
        }
        
        const data = await response.json();
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error('Error fetching popular playlists:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlaylists();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(limit).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 rounded-lg mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No playlists available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map(playlist => (
        <Card key={playlist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-video">
            <img 
              src={playlist.cover} 
              alt={playlist.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate">{playlist.title}</h3>
            <p className="text-sm text-muted-foreground">
              {playlist.tracksCount} tracks • By {playlist.user}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

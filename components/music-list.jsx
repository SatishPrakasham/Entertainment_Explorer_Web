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
        setTracks(data.results);
      } catch (error) {
        console.error('Error fetching trending tracks:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTrendingTracks();
  }, [limit]);

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading trending tracks: {error}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {isLoading ? (
        <MusicCardSkeleton count={limit} />
      ) : tracks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground w-full">
          No trending tracks available
        </div>
      ) : (
        tracks.map(track => (
          <TrackCard key={track.id} track={track} isHorizontal={true} />
        ))
      )}
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
        setAlbums(data.results);
      } catch (error) {
        console.error('Error fetching popular albums:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPopularAlbums();
  }, [limit]);

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading popular albums: {error}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {isLoading ? (
        <MusicCardSkeleton count={limit} />
      ) : albums.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground w-full">
          No popular albums available
        </div>
      ) : (
        albums.map(album => (
          <AlbumCard key={album.id} album={album} isHorizontal={true} />
        ))
      )}
    </div>
  );
}

export function MusicSearchResults({ query, type = 'track', page = 1 }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 0,
    nextPage: null,
    prevPage: null
  });

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/music/search?query=${encodeURIComponent(query)}&type=${type}&page=${page}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setResults(data.results);
        setPagination({
          total: data.total,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          nextPage: data.nextPage,
          prevPage: data.prevPage
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSearchResults();
  }, [query, type, page]);

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading search results: {error}
      </div>
    );
  }

  if (!query) {
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MusicCardSkeleton count={10} />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No results found for "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {type === 'track' ? 
            results.map(track => <TrackCard key={track.id} track={track} />) :
            results.map(album => <AlbumCard key={album.id} album={album} />)
          }
        </div>
      )}
      
      {/* Pagination info */}
      {!isLoading && results.length > 0 && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Showing {results.length} of {pagination.total} results • 
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}

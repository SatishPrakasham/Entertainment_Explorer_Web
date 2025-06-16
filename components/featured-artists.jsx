'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FeaturedArtists({ limit = 6 }) {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedArtists() {
      try {
        setIsLoading(true);
        // Using our backend API route to fetch featured artists
        const response = await fetch(`/api/music/featured-artists?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured artists');
        }
        
        const data = await response.json();
        setArtists(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error('Error fetching featured artists:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeaturedArtists();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array(limit).fill(0).map((_, i) => (
          <Card key={i} className="text-center">
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex justify-center mb-3">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
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

  if (artists.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No featured artists available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {artists.map(artist => (
        <Card key={artist.id} className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 pb-4 px-4">
            <div className="flex justify-center mb-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={artist.picture_medium || '/placeholder.svg'} alt={artist.name || 'Artist'} />
                <AvatarFallback>{artist.name ? artist.name.substring(0, 2).toUpperCase() : 'AR'}</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="font-semibold truncate">{artist.name || 'Unknown Artist'}</h3>
            <p className="text-sm text-muted-foreground">{(artist.nb_fan ? artist.nb_fan.toLocaleString() : '0')} fans</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

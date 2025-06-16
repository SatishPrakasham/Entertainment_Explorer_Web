'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function GenreSelector({ onSelectGenre, selectedGenreId = 132 }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/music/genres');
        
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGenres();
  }, []);

  if (isLoading) {
    return (
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Error loading genres: {error}
      </div>
    );
  }

  if (genres.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        {genres.map(genre => (
          <Button
            key={genre.id}
            variant={genre.id === selectedGenreId ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onSelectGenre(genre.id, genre.name)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function MovieCard({ movie, isHorizontal = false }) {
  // Use Simkl data format
  const imageUrl = movie.posterUrl || "/placeholder.svg?height=300&width=200";
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year || "Unknown";
  const genres = movie.genres?.length > 0 
    ? movie.genres[0]?.name 
    : movie.type || "Entertainment";

  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
        <CardContent className="p-4">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <Image
              src={imageUrl}
              alt={movie.title || "Movie poster"}
              width={200}
              height={300}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" className="rounded-full" onClick={(e) => {
                e.preventDefault();
                // Add to list functionality would go here
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add to List
              </Button>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{movie.overview}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {year} • {genres}
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                // Add to list functionality would go here
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        // Use our API route that connects to Simkl
        const response = await fetch('/api/movies/trending');
        if (!response.ok) {
          throw new Error('Failed to fetch trending shows');
        }
        const data = await response.json();
        
        // Data is already formatted by our API
        setMovies(data.results || []);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-64 h-72 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading trending movies: {error}</div>;
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {movies.slice(0, 10).map((item, index) => (
        <MovieCard 
          key={`trending-${item.id || index}-${Math.random().toString(36).substring(2, 7)}`} 
          movie={item} 
          isHorizontal={true} 
        />
      ))}
    </div>
  );
}

export function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPopularMovies() {
      try {
        // Use our API route that connects to Simkl
        const response = await fetch('/api/movies/popular');
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        
        // Data is already formatted by our API
        setMovies(data.results || []);
      } catch (err) {
        console.error('Error fetching popular movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="h-72 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading popular movies: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((item, index) => (
        <MovieCard 
          key={`popular-${item.id || index}-${Math.random().toString(36).substring(2, 7)}`} 
          movie={item} 
        />
      ))}
    </div>
  );
}

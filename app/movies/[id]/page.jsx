"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AddToListButton } from "@/components/AddToListButton";

// Create a wrapper component to extract the ID from the path
export default function MovieDetailsPage() {
  return <MovieDetails />;
}

// Separate component to avoid params warning
function MovieDetails() {
  const pathname = usePathname();
  // Extract ID from pathname (format: /movies/123)
  const id = pathname.split('/').pop();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        console.log('Fetching movie details for ID:', id);
        // Use our API route that connects to Simkl
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch media details');
        }
        const data = await response.json();
        
        // Enhanced debugging for the received data
        console.log('Movie details received (raw):', JSON.stringify(data, null, 2));
        console.log('Movie title from API:', data.title);
        console.log('Movie type:', data.type);
        console.log('Has poster:', !!data.posterUrl);
        
        // Force a title if none exists
        if (!data.title) {
          console.log('No title found, adding default title');
          data.title = 'Movie ' + id;
        }
        
        // Data is already formatted by our API
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg mb-8"></div>
          <div className="h-10 w-1/3 bg-muted animate-pulse rounded-lg mb-4"></div>
          <div className="h-6 w-1/4 bg-muted animate-pulse rounded-lg mb-8"></div>
          <div className="h-24 w-full bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Link href="/movies" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    console.log('Movie data is null');
    return null;
  }
  
  // Ensure we have valid data with fallbacks
  const title = movie.title || 'Unknown Title';
  const overview = movie.overview || 'No overview available';
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.year || "Unknown");
  const director = movie.director || 'Unknown';
  const writer = movie.writer || 'Unknown';
  const runtime = movie.runtime || 0;
  const voteAverage = movie.voteAverage || 0;
  const voteCount = movie.voteCount || 0;
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const cast = Array.isArray(movie.cast) ? movie.cast : [];
  const country = movie.country || 'Unknown';
  const language = movie.language || 'Unknown';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop Image */}
      <div className="relative h-[50vh] w-full">
        {movie.backdropUrl ? (
          <Image
            src={movie.backdropUrl}
            alt={movie.title || "Movie backdrop"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-32 relative z-10">
        <Link href="/movies" className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Movies
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <Card className="overflow-hidden w-full md:w-64">
              <CardContent className="p-0">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title || "Movie poster"}
                    width={300}
                    height={450}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-96 bg-muted flex items-center justify-center">
                    No Image
                  </div>
                )}
              </CardContent>
            </Card>
            <AddToListButton 
              item={movie} 
              category="movies" 
              className="w-full mt-4"
              showText={true}
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-sm text-gray-400 mb-4">{movie.type === 'tv' ? 'TV Series' : 'Movie'} • {releaseYear}</p>
            
            {movie.tagline && (
              <p className="text-lg text-muted-foreground italic mb-4">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span>{voteAverage.toFixed(1)} ({voteCount.toLocaleString()} votes)</span>
              </div>
              
              {runtime > 0 && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
                </div>
              )}
              
              {movie.releaseDate && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, index) => (
                <span key={genre.id || `genre-${movie.id}-${index}`} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">{overview}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-24 font-medium">Director:</dt>
                    <dd className="text-muted-foreground">{director}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 font-medium">Writer:</dt>
                    <dd className="text-muted-foreground">{writer}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 font-medium">Country:</dt>
                    <dd className="text-muted-foreground">{country}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 font-medium">Language:</dt>
                    <dd className="text-muted-foreground">{language}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {cast.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((person, index) => (
                    <div key={person.id || `cast-${movie.id}-${index}`} className="text-center">
                      <div className="w-full aspect-square rounded-full overflow-hidden mb-2 bg-muted">
                        {person.profileUrl ? (
                          <Image
                            src={person.profileUrl}
                            alt={person.name || "Cast member"}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

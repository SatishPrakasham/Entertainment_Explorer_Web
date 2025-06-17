"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function GenreSelector({ onSelectGenre, selectedGenreId = "all" }) {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        setIsLoading(true);
        // Define the genres for books
        const bookGenres = [
          { id: "all", name: "All Genres" },
          { id: "fiction", name: "Fiction" },
          { id: "non-fiction", name: "Non-fiction" },
          { id: "fantasy", name: "Fantasy" },
          { id: "mystery", name: "Mystery" },
          { id: "romance", name: "Romance" },
        ];

        setGenres(bookGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGenres();
  }, []);

  // Display loading skeleton while fetching genres
  if (isLoading) {
    return (
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 bg-gray-300 animate-pulse rounded-full" />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="text-sm text-red-500">
        Error loading genres: {error}
      </div>
    );
  }

  // If there are no genres, return nothing
  if (genres.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        {genres.map((genre) => (
          <Button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)} // Select the genre when clicked
            className={`rounded-full 
              ${genre.id === selectedGenreId
                ? "bg-purple-500 text-white" // Selected genre
                : "bg-transparent text-black border border-gray-300"} // Unselected genre (transparent)
            `}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

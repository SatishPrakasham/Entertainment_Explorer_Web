"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToListButton } from "@/components/AddToListButton";

// BookCard: Display individual book details (cover, title, description, etc.)
export function BookCard({ book, isHorizontal = false }) {
  const imageUrl = book.coverUrl || "/placeholder.svg?height=300&width=200";
  const year = book.year || "Unknown";
  const genres = book.genre || "Fiction";

  return (
    <Link href={`/books/${book.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow group w-full">
        <CardContent className="p-4">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <Image
              src={imageUrl}
              alt={book.title || "Book cover"}
              width={200}
              height={300}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <AddToListButton 
                item={book} 
                category="books" 
                size="sm" 
                className="rounded-full"
              />
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{book.title}</h3>
          {/* {book.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
          )} */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{year} • {genres}</span>
            <AddToListButton 
              item={book} 
              category="books" 
              variant="outline" 
              className="rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

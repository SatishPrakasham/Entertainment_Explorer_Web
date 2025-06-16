"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function BookCard({ book, isHorizontal = false }) {
  // Transform book data to match component expectations
  const imageUrl = book.coverUrl || "/placeholder.svg?height=300&width=200";
  const year = book.firstPublishYear || "Unknown";
  const genres = book.subjects?.[0] || "Fiction";
  
  return (
    <Link href={`/books/${book.id}`} className="block">
      <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
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
              <Button size="sm" className="rounded-full" onClick={(e) => {
                e.preventDefault();
                // Add to list functionality would go here
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add to List
              </Button>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
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

export default BookCard;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getBookById } from "@/lib/openLibraryApi";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // You can use a button component from your design system

export default function BookDetailsPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract the book ID from the URL

  useEffect(() => {
    // Fetch the book details from the Open Library API
    async function loadBook() {
      const data = await getBookById(id);
      setBook(data);
      setLoading(false);
    }
    loadBook();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!book) return <div className="p-8 text-center text-red-500">Book not found.</div>;

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-4xl mx-auto">
      {/* Back to Books Link */}
      <Link href="/books" className="inline-flex items-center mb-4 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Books
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Cover Image */}
        <div className="w-full md:w-1/3">
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={300}
            height={450}
            className="rounded-lg object-cover"
          />
          <AddToListButton 
            item={book} 
            category="books" 
            className="mt-4 w-full" 
            variant="outline"
            showText={true}
          />
        </div>

        {/* Book Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">{book.author} • {book.year}</p>

          {/* Display description if available */}
          <p className="text-muted-foreground mb-4">{book.description || "No description available"}</p>

          {/* Additional Book Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Genres</h2>
            <p className="text-muted-foreground">{book.genre || "Not available"}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Publisher</h2>
            <p className="text-muted-foreground">{book.publisher || "Not available"}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">ISBN</h2>
            <p className="text-muted-foreground">{book.isbn ? book.isbn.join(", ") : "Not available"}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Number of Pages</h2>
            <p className="text-muted-foreground">{book.number_of_pages || "Not available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

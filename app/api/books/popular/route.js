import { NextResponse } from "next/server";
import { getBooks } from "@/lib/books-api";

export async function GET() {
  try {
    // Fetch popular books
    const books = await getBooks('', 'popular');
    
    // Return first 20 books
    const popularBooks = books.slice(0, 20);

    return NextResponse.json({
      books: popularBooks,
      total: popularBooks.length,
      page: 1,
      limit: 20
    });
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular books", details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getBooks } from "@/lib/books-api";

export async function GET() {
  try {
    // Fetch trending books
    const books = await getBooks('', 'trending');
    
    // Return first 20 books
    const trendingBooks = books.slice(0, 20);

    return NextResponse.json({
      books: trendingBooks,
      total: trendingBooks.length,
      page: 1,
      limit: 20
    });
  } catch (error) {
    console.error("Error fetching trending books:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending books", details: error.message },
      { status: 500 }
    );
  }
}

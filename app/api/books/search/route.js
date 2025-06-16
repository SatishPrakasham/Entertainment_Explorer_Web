import { NextResponse } from "next/server";
import { getBooks } from "@/lib/books-api";

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    // Fetch search results
    const books = await getBooks(query);
    
    // Return first 20 results
    const searchResults = books.slice(0, 20);

    return NextResponse.json({
      books: searchResults,
      total: searchResults.length,
      page: 1,
      limit: 20
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return NextResponse.json(
      { error: "Failed to search books", details: error.message },
      { status: 500 }
    );
  }
}

import { searchMusic } from "@/lib/deezer";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'track';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required',
        results: [],
        total: 0,
        currentPage: page,
        totalPages: 0
      }, { status: 400 });
    }
    
    const index = (page - 1) * limit;
    const data = await searchMusic(query, type, limit, index);
    
    // Calculate total pages
    const totalPages = Math.ceil(data.total / limit) || 0;
    
    return NextResponse.json({
      results: data.results,
      total: data.total,
      currentPage: page,
      totalPages,
      nextPage: data.nextPage !== null ? page + 1 : null,
      prevPage: data.prevPage !== null ? page - 1 : null
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ 
      error: 'Failed to search music',
      results: [],
      total: 0,
      currentPage: page,
      totalPages: 0
    }, { status: 500 });
  }
}

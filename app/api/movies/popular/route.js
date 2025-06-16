import { getPopularMovies } from '@/lib/omdb';

// Debug helper
function logObject(label, obj) {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
}

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    console.log('Fetching popular movies from OMDb, page:', page);
    
    // Fetch popular movies using our helper function that simulates popular movies
    // since OMDb doesn't have a dedicated popular endpoint
    const formattedData = await getPopularMovies(parseInt(page));
    
    // Debug formatted data
    console.log('Formatted popular movies count:', formattedData.results.length);
    if (formattedData.results.length > 0) {
      console.log('First formatted movie title:', formattedData.results[0].title);
      console.log('First formatted movie details:', {
        id: formattedData.results[0].id,
        title: formattedData.results[0].title,
        posterUrl: formattedData.results[0].posterUrl ? 'Present' : 'Missing',
        year: formattedData.results[0].year,
        type: formattedData.results[0].type
      });
    }
    
    return Response.json(formattedData);
  } catch (error) {
    console.error('Error fetching popular movies from OMDb:', error);
    return Response.json({ 
      error: 'Failed to fetch popular movies', 
      page: 1,
      results: [],
      totalPages: 0,
      totalResults: 0
    }, { status: 500 });
  }
}

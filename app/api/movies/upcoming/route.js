import { fetchFromSimkl, formatMovieData } from '@/lib/simkl';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    // Fetch anticipated movies from Simkl
    // Simkl doesn't have a direct 'upcoming' endpoint, so we use anticipated
    const data = await fetchFromSimkl('/movies/anticipated/', { 
      extended: 'full',
      page: page,
      limit: 20
    });
    
    // Format the response
    const formattedData = {
      page: parseInt(page),
      results: Array.isArray(data) ? data.map(formatMovieData) : [],
      totalPages: 10, // Simkl doesn't always provide total pages
      totalResults: 200, // Approximate
    };
    
    return Response.json(formattedData);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return Response.json({ error: 'Failed to fetch upcoming movies' }, { status: 500 });
  }
}

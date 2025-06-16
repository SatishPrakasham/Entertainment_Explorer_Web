// Import necessary utilities
import { getDetailsByImdbId, formatMovieData } from '@/lib/omdb';

// Set API key from environment variables
const OMDb_API_KEY = process.env.OMDb_API_KEY || process.env.NEXT_PUBLIC_OMDb_API_KEY;
const OMDb_API_BASE_URL = process.env.NEXT_PUBLIC_OMDb_API_BASE_URL || 'https://www.omdbapi.com';

// Debug helper
function logObject(label, obj) {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
}

// Validate media data to ensure it has required fields
function validateMediaData(media) {
  return media && media.id && media.title && media.posterUrl;
}

export async function GET(request, context) {
  try {
    // Properly extract and await params
    const params = await context.params;
    let id = params.id;
    
    // Check if this is an IMDb ID (starts with 'tt')
    const isImdbId = id.startsWith('tt');
    
    // If it's not an IMDb ID, check if it's our custom format
    if (!isImdbId) {
      // Extract the IMDb ID if it's embedded in our custom format
      // Format could be like "movie-tt1234567" or just "tt1234567"
      const imdbIdMatch = id.match(/tt\d+/);
      if (imdbIdMatch) {
        id = imdbIdMatch[0];
        console.log(`Extracted IMDb ID: ${id} from ${params.id}`);
      }
    }
    
    // Fetch movie details from OMDb API using IMDb ID
    console.log(`Fetching details for IMDb ID: ${id}`);
    const movieData = await getDetailsByImdbId(id);
    
    // If we got valid data back
    if (movieData) {
      // Format the movie data
      const formattedMovie = formatMovieData(movieData);
      
      // Validate the formatted data
      if (validateMediaData(formattedMovie)) {
        console.log('Successfully formatted movie data with title:', formattedMovie.title);
        logObject('Formatted movie data', formattedMovie);
        return Response.json(formattedMovie);
      }
    }
    
    // If all attempts fail, create a fallback response with minimal data
    // This ensures the UI always has something to display
    console.log('OMDb API attempt failed, creating fallback response');
    
    // Create a fallback response with the information we have
    const fallbackResponse = {
      id: id,
      title: `Movie ${id}`,
      overview: 'Information could not be retrieved from the OMDb API. This could be due to an invalid IMDb ID or API restrictions.',
      posterUrl: null,
      backdropUrl: null,
      year: null,
      type: 'unknown',
      genres: [],
      cast: [],
      runtime: 0,
      status: 'Unknown',
      voteAverage: 0,
      voteCount: 0
    };
    
    // Return the fallback response
    return Response.json(fallbackResponse);
  } catch (error) {
    // We may not have access to id if the error happened before extracting it
    console.error(`Error fetching item details:`, error);
    return Response.json({ 
      error: 'Failed to fetch details',
      id: context.params?.id || 'unknown',
      title: 'Error Loading Content',
      overview: 'There was an error loading this content from the OMDb API. Please try again later.',
      type: 'error'
    }, { status: 500 });
  }
}

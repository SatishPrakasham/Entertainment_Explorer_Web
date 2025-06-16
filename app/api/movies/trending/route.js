import { getTrendingShows } from '@/lib/omdb';

// Debug helper
function logObject(label, obj) {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
}

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    console.log('Fetching trending shows from OMDb, page:', page);
    
    // Fetch trending shows using our helper function that simulates trending shows
    // since OMDb doesn't have a dedicated trending endpoint
    const formattedData = await getTrendingShows(parseInt(page));
    
    // Debug formatted data
    console.log('Formatted trending shows count:', formattedData.results.length);
    if (formattedData.results.length > 0) {
      logObject('First formatted show', formattedData.results[0]);
      console.log('First formatted show title:', formattedData.results[0].title);
      console.log('First formatted show details:', {
        id: formattedData.results[0].id,
        title: formattedData.results[0].title,
        posterUrl: formattedData.results[0].posterUrl ? 'Present' : 'Missing',
        year: formattedData.results[0].year,
        type: formattedData.results[0].type
      });
    }
    
    return Response.json(formattedData);
  } catch (error) {
    console.error('Error fetching trending shows from OMDb:', error);
    return Response.json({ 
      error: 'Failed to fetch trending shows', 
      page: 1,
      results: [],
      totalPages: 0,
      totalResults: 0
    }, { status: 500 });
  }
}

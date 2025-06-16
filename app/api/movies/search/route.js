import { searchMovies, searchShows, formatSearchResults } from '@/lib/omdb';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || 1;
    const type = searchParams.get('type') || 'all'; // 'movie', 'series', or 'all'
    const genre = searchParams.get('genre');
    const year = searchParams.get('year');
    
    // If no query and no filters, return error
    if (!query && !genre && !year) {
      return Response.json({ 
        error: 'At least one search parameter (query, genre, or year) is required',
        page: 1,
        results: [],
        totalPages: 0,
        totalResults: 0
      }, { status: 400 });
    }
    
    console.log(`Searching OMDb for "${query || ''}" (type: ${type}, page: ${page}, genre: ${genre || 'any'}, year: ${year || 'any'})`);
    
    let movieResults = { Search: [], totalResults: '0' };
    let showResults = { Search: [], totalResults: '0' };
    
    // Determine search type based on parameters
    const searchType = type === 'all' ? null : type;
    
    // If we have a query, search by query
    if (query) {
      // Search based on the requested type
      if (type === 'all' || type === 'movie') {
        movieResults = await searchMovies(query, parseInt(page), year);
        console.log(`Found ${movieResults?.Search?.length || 0} movies for "${query}"`);
      }
      
      if (type === 'all' || type === 'series' || type === 'tv') {
        showResults = await searchShows(query, parseInt(page), year);
        console.log(`Found ${showResults?.Search?.length || 0} shows for "${query}"`);
      }
    } 
    // If no query but we have genre/year filters, use popular movies/shows as base
    else if (genre || year) {
      // Get popular movies and shows as base for filtering
      if (type === 'all' || type === 'movie') {
        const popularMoviesResponse = await searchMovies('popular', parseInt(page), year);
        if (popularMoviesResponse?.Search) {
          movieResults = popularMoviesResponse;
        }
      }
      
      if (type === 'all' || type === 'series' || type === 'tv') {
        const popularShowsResponse = await searchShows('popular', parseInt(page), year);
        if (popularShowsResponse?.Search) {
          showResults = popularShowsResponse;
        }
      }
    }
    
    // Combine and format the results
    const combinedResults = {
      Search: [...(movieResults?.Search || []), ...(showResults?.Search || [])],
      totalResults: (parseInt(movieResults?.totalResults || 0) + parseInt(showResults?.totalResults || 0)).toString(),
      page: page.toString()
    };
    
    // Format the search results
    const formattedData = formatSearchResults(combinedResults);
    
    // Apply genre filtering if specified (client-side filtering)
    if (genre && genre !== 'all' && formattedData.results) {
      console.log(`Filtering by genre: ${genre}`);
      
      // Define genre keywords mapping for better filtering
      const genreKeywords = {
        'action': ['action', 'adventure', 'war', 'western', 'fight', 'combat', 'battle'],
        'comedy': ['comedy', 'funny', 'humor', 'sitcom', 'laugh'],
        'drama': ['drama', 'emotional', 'biography', 'history'],
        'fantasy': ['fantasy', 'magic', 'mythical', 'supernatural'],
        'horror': ['horror', 'scary', 'terror', 'nightmare', 'monster'],
        'mystery': ['mystery', 'detective', 'crime', 'thriller', 'suspense'],
        'romance': ['romance', 'love', 'romantic', 'relationship'],
        'sci-fi': ['sci-fi', 'science fiction', 'space', 'future', 'alien', 'robot'],
        'thriller': ['thriller', 'suspense', 'tension', 'crime'],
        'documentary': ['documentary', 'real', 'true story', 'history'],
        'animation': ['animation', 'cartoon', 'animated', 'anime'],
        'family': ['family', 'children', 'kids', 'child-friendly'],
        'crime': ['crime', 'criminal', 'detective', 'police', 'mafia', 'gangster'],
        'adventure': ['adventure', 'quest', 'journey', 'exploration'],
        'superhero': ['superhero', 'hero', 'comic', 'marvel', 'dc']
      };
      
      // Get keywords for the selected genre
      const targetKeywords = genreKeywords[genre.toLowerCase()] || [genre.toLowerCase()];
      
      formattedData.results = formattedData.results.filter(item => {
        // Check if the item has genres and if any genre matches the filter
        if (item.genres && Array.isArray(item.genres)) {
          return item.genres.some(g => 
            targetKeywords.some(keyword => g.toLowerCase().includes(keyword))
          );
        }
        
        // If no genres, try to match by title or type
        const titleLower = item.title.toLowerCase();
        return targetKeywords.some(keyword => titleLower.includes(keyword)) ||
               (genre.toLowerCase() === item.type.toLowerCase());
      });
      
      console.log(`After genre filtering: ${formattedData.results.length} results`);
      
      // Update total results count
      formattedData.totalResults = formattedData.results.length;
      formattedData.totalPages = Math.ceil(formattedData.results.length / 10);
    }
    
    // Apply year filtering if needed (for decade ranges - client-side filtering)
    if (year && year !== 'all' && formattedData.results) {
      // Handle decade ranges that OMDb API doesn't support natively
      if (['2010s', '2000s', '1990s', 'older'].includes(year)) {
        formattedData.results = formattedData.results.filter(item => {
          const itemYear = item.year ? parseInt(item.year) : null;
          if (!itemYear) return false;
          
          switch(year) {
            case '2010s': return itemYear >= 2010 && itemYear <= 2019;
            case '2000s': return itemYear >= 2000 && itemYear <= 2009;
            case '1990s': return itemYear >= 1990 && itemYear <= 1999;
            case 'older': return itemYear < 1990;
            default: return true;
          }
        });
        
        // Update total results count
        formattedData.totalResults = formattedData.results.length;
        formattedData.totalPages = Math.ceil(formattedData.results.length / 10);
      }
    }
    
    // Log some debug info
    console.log(`Returning ${formattedData.results.length} formatted search results`);
    if (formattedData.results.length > 0) {
      console.log('First result:', {
        id: formattedData.results[0].id,
        title: formattedData.results[0].title,
        type: formattedData.results[0].type,
        year: formattedData.results[0].year
      });
    }
    
    return Response.json(formattedData);
  } catch (error) {
    console.error('Error searching media with OMDb:', error);
    return Response.json({ 
      error: 'Failed to search media',
      page: 1,
      results: [],
      totalPages: 0,
      totalResults: 0
    }, { status: 500 });
  }
}

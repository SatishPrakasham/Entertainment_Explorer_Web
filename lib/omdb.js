/**
 * OMDb API helper functions
 * Documentation: http://www.omdbapi.com/
 */

// Get API key from environment variables
const OMDB_API_KEY = process.env.OMDB_API_KEY || '6c9addb7';
const OMDB_API_BASE_URL = 'http://www.omdbapi.com';

// Debug helper
function logObject(label, obj) {
  console.log(`${label}:`, JSON.stringify(obj, null, 2));
}

/**
 * Fetch data from OMDb API
 * @param {string} endpoint - The endpoint to fetch from
 * @param {Object} params - Additional parameters to include in the request
 * @returns {Promise<Object>} - The response data
 */
export async function fetchFromOMDb(params = {}) {
  try {
    // Build URL with API key and params
    const queryParams = new URLSearchParams({
      apikey: OMDB_API_KEY,
      ...params
    });
    
    const url = `${OMDB_API_BASE_URL}/?${queryParams.toString()}`;
    console.log('Fetching from OMDb:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.Response === 'False') {
      console.error('OMDb API returned error:', data.Error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from OMDb:', error);
    return null;
  }
}

/**
 * Search movies by title
 * @param {string} query - The search query
 * @param {number} page - The page number (1-based)
 * @param {string} year - Optional year filter
 * @returns {Promise<Object>} - Search results
 */
export async function searchMovies(query, page = 1, year = null) {
  const params = {
    s: query,
    type: 'movie',
    page: page.toString()
  };
  
  // Add year parameter if provided (only for specific years, not decades)
  if (year && !isNaN(parseInt(year)) && year.length === 4) {
    params.y = year;
  }
  
  return fetchFromOMDb(params);
}

/**
 * Search TV shows by title
 * @param {string} query - The search query
 * @param {number} page - The page number (1-based)
 * @param {string} year - Optional year filter
 * @returns {Promise<Object>} - Search results
 */
export async function searchShows(query, page = 1, year = null) {
  const params = {
    s: query,
    type: 'series',
    page: page.toString()
  };
  
  // Add year parameter if provided (only for specific years, not decades)
  if (year && !isNaN(parseInt(year)) && year.length === 4) {
    params.y = year;
  }
  
  return fetchFromOMDb(params);
}

/**
 * Get movie or show details by IMDb ID
 * @param {string} imdbId - The IMDb ID
 * @returns {Promise<Object>} - Detailed information
 */
export async function getDetailsByImdbId(imdbId) {
  return fetchFromOMDb({
    i: imdbId,
    plot: 'full'
  });
}

/**
 * Get movie or show details by title (exact match)
 * @param {string} title - The exact title
 * @param {string} type - Type of media (movie, series, episode)
 * @param {number} year - Optional year of release
 * @returns {Promise<Object>} - Detailed information
 */
export async function getDetailsByTitle(title, type = 'movie', year = null) {
  const params = {
    t: title,
    type: type
  };
  
  if (year) {
    params.y = year.toString();
  }
  
  return fetchFromOMDb(params);
}

/**
 * Format movie data from OMDb API response
 * @param {Object} movie - Raw movie data from OMDb
 * @returns {Object} - Formatted movie data
 */
export function formatMovieData(movie) {
  if (!movie) return null;
  
  // Log the raw movie data for debugging
  console.log('Raw OMDb movie data:', JSON.stringify(movie, null, 2));
  
  // Extract genre data
  const genres = movie.Genre ? movie.Genre.split(', ').map((genre, idx) => ({
    id: `${movie.imdbID}-genre-${idx}`,
    name: genre
  })) : [];
  
  // Extract cast data
  const cast = movie.Actors ? movie.Actors.split(', ').map((actor, idx) => ({
    id: `${movie.imdbID}-actor-${idx}`,
    name: actor,
    character: '',
    profileUrl: null
  })) : [];
  
  // Extract rating
  const imdbRating = parseFloat(movie.imdbRating) || 0;
  const imdbVotes = parseInt(movie.imdbVotes?.replace(/,/g, '') || '0', 10);
  
  // Extract runtime in minutes
  let runtime = 0;
  if (movie.Runtime) {
    const runtimeMatch = movie.Runtime.match(/(\d+)/);
    if (runtimeMatch) {
      runtime = parseInt(runtimeMatch[1], 10);
    }
  }
  
  // Extract year
  let year = null;
  if (movie.Year) {
    const yearMatch = movie.Year.match(/(\d{4})/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }
  }
  
  // Format release date
  let releaseDate = null;
  if (movie.Released && movie.Released !== 'N/A') {
    try {
      // Convert from "DD MMM YYYY" to "YYYY-MM-DD"
      const date = new Date(movie.Released);
      releaseDate = date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error parsing release date:', e);
    }
  }
  
  // Determine media type
  const type = movie.Type === 'series' ? 'tv' : movie.Type || 'movie';
  
  return {
    id: movie.imdbID,
    title: movie.Title || 'Untitled',
    overview: movie.Plot || '',
    posterUrl: movie.Poster !== 'N/A' ? movie.Poster : null,
    backdropUrl: movie.Poster !== 'N/A' ? movie.Poster : null, // OMDb doesn't provide backdrop images
    releaseDate: releaseDate,
    runtime: runtime,
    genres: genres,
    cast: cast,
    year: year,
    type: type,
    voteAverage: imdbRating,
    voteCount: imdbVotes,
    status: movie.Released ? 'Released' : 'Unknown',
    director: movie.Director !== 'N/A' ? movie.Director : '',
    writer: movie.Writer !== 'N/A' ? movie.Writer : '',
    language: movie.Language !== 'N/A' ? movie.Language : '',
    country: movie.Country !== 'N/A' ? movie.Country : '',
    awards: movie.Awards !== 'N/A' ? movie.Awards : '',
    production: movie.Production !== 'N/A' ? movie.Production : '',
    rated: movie.Rated !== 'N/A' ? movie.Rated : '',
    // Store original data for reference
    imdbID: movie.imdbID
  };
}

/**
 * Format search results from OMDb API
 * @param {Object} searchResponse - Raw search response from OMDb
 * @returns {Object} - Formatted search results
 */
export function formatSearchResults(searchResponse) {
  if (!searchResponse || !searchResponse.Search || !Array.isArray(searchResponse.Search)) {
    return {
      page: 1,
      results: [],
      totalPages: 0,
      totalResults: 0
    };
  }
  
  // Add common genres based on movie/show type for filtering
  const commonGenres = {
    movie: {
      action: ['action', 'adventure', 'war', 'western'],
      comedy: ['comedy', 'family'],
      drama: ['drama', 'biography', 'history'],
      fantasy: ['fantasy', 'sci-fi', 'science fiction'],
      horror: ['horror', 'thriller'],
      mystery: ['mystery', 'crime'],
      romance: ['romance', 'musical'],
      'sci-fi': ['sci-fi', 'science fiction'],
      thriller: ['thriller', 'crime']
    },
    series: {
      action: ['action', 'adventure'],
      comedy: ['comedy', 'sitcom'],
      drama: ['drama'],
      fantasy: ['fantasy', 'sci-fi'],
      horror: ['horror'],
      mystery: ['mystery', 'crime'],
      romance: ['romance'],
      'sci-fi': ['sci-fi', 'science fiction'],
      thriller: ['thriller']
    }
  };
  
  // Assign probable genres based on title keywords
  const keywordGenreMap = {
    'action': ['action'],
    'adventure': ['adventure'],
    'comedy': ['comedy'],
    'drama': ['drama'],
    'horror': ['horror'],
    'thriller': ['thriller'],
    'mystery': ['mystery'],
    'sci-fi': ['sci-fi'],
    'fantasy': ['fantasy'],
    'romance': ['romance'],
    'war': ['action', 'drama'],
    'western': ['western', 'action'],
    'crime': ['crime', 'thriller'],
    'family': ['family', 'comedy'],
    'animation': ['animation', 'family'],
    'documentary': ['documentary'],
    'biography': ['biography', 'drama'],
    'musical': ['musical', 'romance'],
    'sport': ['sport'],
    'superhero': ['action', 'adventure', 'fantasy']
  };
  
  // Format each search result
  const results = searchResponse.Search.map((item, index) => {
    // Extract year from the Year field (which might be a range like "2014–2019")
    const yearMatch = item.Year ? item.Year.match(/^\d{4}/) : null;
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
    
    // Determine type and set default genres based on type
    const type = item.Type === 'series' ? 'tv' : item.Type || 'movie';
    
    // Try to infer genres from title
    const titleLower = item.Title ? item.Title.toLowerCase() : '';
    const inferredGenres = [];
    
    // Check title for genre keywords
    Object.keys(keywordGenreMap).forEach(keyword => {
      if (titleLower.includes(keyword.toLowerCase())) {
        inferredGenres.push(...keywordGenreMap[keyword]);
      }
    });
    
    // If no genres inferred, assign default genres based on type
    const genres = inferredGenres.length > 0 ? 
      [...new Set(inferredGenres)] : 
      ['drama', type === 'tv' ? 'series' : 'movie'];
    
    return {
      id: item.imdbID,
      title: item.Title || `Untitled ${index + 1}`,
      posterUrl: item.Poster !== 'N/A' ? item.Poster : null,
      year: year,
      type: type,
      // Add genres for filtering
      genres: genres,
      // These fields are not available in search results but included for compatibility
      overview: '',
      backdropUrl: null,
      voteAverage: 0,
      voteCount: 0
    };
  });
  
  // Calculate total pages
  const totalResults = parseInt(searchResponse.totalResults, 10) || 0;
  const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page
  
  return {
    page: parseInt(searchResponse.page || '1', 10),
    results: results,
    totalPages: totalPages,
    totalResults: totalResults
  };
}

/**
 * Get popular movies (simulated as OMDb doesn't have a popular endpoint)
 * Uses a predefined list of popular movie titles to search for
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Formatted popular movies
 */
export async function getPopularMovies(page = 1) {
  // List of popular movie titles to search for - diverse selection
  const popularTitles = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'Pulp Fiction',
    'Fight Club',
    'Forrest Gump',
    'Inception',
    'The Matrix',
    'Goodfellas',
    'The Lord of the Rings',
    'Interstellar',
    'Parasite',
    'Joker',
    'Avengers',
    'Star Wars',
    'Titanic',
    'Avatar',
    'Jurassic Park',
    'The Lion King',
    'Gladiator'
  ];
  
  // Calculate start and end indices for pagination
  const itemsPerPage = 10;
  const startIndex = ((page - 1) * itemsPerPage) % popularTitles.length;
  
  // Collect results from multiple searches to ensure diversity
  let allResults = [];
  
  // Get a batch of movies based on the page
  for (let i = 0; i < itemsPerPage; i++) {
    const titleIndex = (startIndex + i) % popularTitles.length;
    const title = popularTitles[titleIndex];
    
    // Search for the title
    try {
      const searchResult = await searchMovies(title, 1);
      
      if (searchResult && searchResult.Search && searchResult.Search.length > 0) {
        // Take only the first result to avoid duplicates of the same movie
        const firstResult = searchResult.Search[0];
        
        // Check if this movie is already in our results (avoid duplicates)
        const isDuplicate = allResults.some(movie => 
          movie.imdbID === firstResult.imdbID || 
          movie.Title === firstResult.Title
        );
        
        if (!isDuplicate) {
          allResults.push(firstResult);
        }
      }
    } catch (error) {
      console.error(`Error searching for ${title}:`, error);
    }
  }
  
  // Format the search results
  const formattedResults = allResults.map((item, index) => ({
    id: item.imdbID,
    title: item.Title || `Movie ${index + 1}`,
    posterUrl: item.Poster !== 'N/A' ? item.Poster : null,
    year: item.Year ? parseInt(item.Year, 10) : null,
    type: item.Type === 'series' ? 'tv' : item.Type || 'movie',
    overview: '',
    backdropUrl: null,
    voteAverage: 0,
    voteCount: 0
  }));
  
  return {
    page: parseInt(page),
    results: formattedResults,
    totalPages: Math.ceil(popularTitles.length / itemsPerPage),
    totalResults: popularTitles.length
  };
}

/**
 * Get trending shows (simulated as OMDb doesn't have a trending endpoint)
 * Uses a predefined list of popular show titles to search for
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Formatted trending shows
 */
export async function getTrendingShows(page = 1) {
  // List of popular show titles to search for
  const popularShows = [
    'Breaking Bad',
    'Game of Thrones',
    'Stranger Things',
    'The Office',
    'Friends',
    'The Mandalorian',
    'The Crown',
    'Westworld',
    'Black Mirror',
    'The Witcher'
  ];
  
  // Get a random title from the list based on the page
  const index = (page - 1) % popularShows.length;
  const title = popularShows[index];
  
  // Search for the title
  const searchResult = await searchShows(title, 1);
  
  if (searchResult && searchResult.Search) {
    // Format the search results
    return formatSearchResults({
      ...searchResult,
      page: page.toString()
    });
  }
  
  // Return empty results if search failed
  return {
    page: page,
    results: [],
    totalPages: 1,
    totalResults: 0
  };
}

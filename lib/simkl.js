// Simkl API configuration
const SIMKL_API_BASE_URL = 'https://api.simkl.com';
const SIMKL_IMAGE_BASE_URL = 'https://wsrv.nl/?url=https://simkl.in';

// API key - using the client ID from .env file
const SIMKL_CLIENT_ID = process.env.SIMKL_API_CLIENT_ID || process.env.NEXT_PUBLIC_SIMKL_CLIENT_ID;
const SIMKL_CLIENT_SECRET = process.env.SIMKL_API_CLIENT_SECRET;

// Validate that we have the required API credentials
if (!SIMKL_CLIENT_ID) {
  console.error('SIMKL_API_CLIENT_ID environment variable is not set');
}

// Common headers for API requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SIMKL_CLIENT_ID}`,
  'simkl-api-key': SIMKL_CLIENT_ID
};

// Helper function to make API requests
async function fetchFromSimkl(endpoint, params = {}) {
  // Always include client_id in the params
  const allParams = { client_id: SIMKL_CLIENT_ID, ...params };
  const queryParams = new URLSearchParams(allParams).toString();
  const url = `${SIMKL_API_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  
  console.log('Fetching from Simkl:', url);
  
  try {
    const response = await fetch(url, { 
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Simkl API error response:', errorText);
      throw new Error(`Simkl API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Handle empty responses
    if (!data) {
      console.warn('Empty response from Simkl API');
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Simkl:', error);
    throw error;
  }
}

// Image URL helper
function getImageUrl(path, type = 'posters', suffix = '_c') {
  if (!path) return null;
  return `${SIMKL_IMAGE_BASE_URL}/${type}/${path}${suffix}.webp`;
}

// Format movie data
function formatMovieData(movie, index = 0) {
  if (!movie) return null;
  
  // Log the raw movie data to debug
  console.log('Raw movie data in formatter:', JSON.stringify(movie, null, 2));
  
  // Create a truly unique ID by combining any available ID with index
  const uniqueId = movie.ids?.simkl || movie.movie_id || movie.id || `movie-${index}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle different API response formats
  // Sometimes the data is nested under 'movie' property
  const movieData = movie.movie || movie;
  
  // Extract title with enhanced handling of different API response formats
  // Simkl API can return title in different places depending on the endpoint
  let title = null;
  
  // Try different possible locations for the title
  if (movieData.title) {
    title = movieData.title;
    console.log('Found title directly in movieData.title:', title);
  } else if (movie.title) {
    title = movie.title;
    console.log('Found title in movie.title:', title);
  } else if (movie.movie && movie.movie.title) {
    title = movie.movie.title;
    console.log('Found title in movie.movie.title:', title);
  } else if (movieData.name) {
    title = movieData.name;
    console.log('Found title in movieData.name:', title);
  } else if (movie.show && movie.show.title) {
    title = movie.show.title;
    console.log('Found title in movie.show.title:', title);
  } else if (movieData.ids && movieData.ids.slug) {
    // Try to extract title from slug if available
    const titleFromSlug = movieData.ids.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    title = titleFromSlug;
    console.log('Extracted title from slug:', title);
  } else {
    // If we still don't have a title, use a fixed placeholder instead of the ID
    title = `Movie ${uniqueId}`;
    console.log('No title found, using ID-based placeholder');
  }
  
  // Extract release date safely with more fallbacks
  let releaseDate = null;
  if (movieData.released) {
    releaseDate = movieData.released;
  } else if (movie.released) {
    releaseDate = movie.released;
  } else if (movieData.first_aired) {
    releaseDate = movieData.first_aired;
  } else if (movie.first_aired) {
    releaseDate = movie.first_aired;
  } else if (movieData.year) {
    releaseDate = `${movieData.year}-01-01`; // Default to January 1st of the year
  } else if (movie.year) {
    releaseDate = `${movie.year}-01-01`;
  } else if (movieData.date) {
    releaseDate = movieData.date;
  } else if (movie.date) {
    releaseDate = movie.date;
  }
  
  // Extract overview safely with more fallbacks
  const overview = movieData.overview || movie.overview || movieData.description || movie.description || '';
  
  // Extract genres safely
  let genres = [];
  if (Array.isArray(movieData.genres)) {
    genres = movieData.genres.map((genre, idx) => ({
      id: `${uniqueId}-genre-${idx}`,
      name: genre
    }));
  } else if (typeof movieData.genres === 'object' && movieData.genres !== null) {
    // Handle case where genres might be an object
    genres = Object.keys(movieData.genres).map((key, idx) => ({
      id: `${uniqueId}-genre-${idx}`,
      name: key
    }));
  }
  
  // Extract cast safely
  let cast = [];
  if (Array.isArray(movieData.cast)) {
    cast = movieData.cast.map((person, idx) => ({
      id: `${uniqueId}-cast-${idx}`,
      name: person.name || 'Unknown Actor',
      character: person.character || '',
      profileUrl: person.image ? getImageUrl(person.image, 'people') : null
    }));
  }
  
  // Extract poster and backdrop URLs safely with more fallbacks
  const posterPath = movieData.poster || movie.poster || (movieData.images && movieData.images.poster) || (movie.images && movie.images.poster) || '';
  const backdropPath = movieData.fanart || movie.fanart || (movieData.images && movieData.images.fanart) || (movie.images && movie.images.fanart) || '';
  
  return {
    id: uniqueId,
    title: title, 
    overview: overview,
    posterUrl: posterPath ? getImageUrl(posterPath, 'posters') : null,
    backdropUrl: backdropPath ? getImageUrl(backdropPath, 'fanart', '_medium') : null,
    releaseDate: releaseDate,
    voteAverage: movieData.ratings?.simkl?.rating || 0,
    voteCount: movieData.ratings?.simkl?.votes || 0,
    popularity: movieData.ratings?.simkl?.rank || 9999,
    genres: genres,
    cast: cast,
    runtime: movieData.runtime || 0,
    year: movieData.year || null,
    type: movieData.type || 'movie',
  };
}

// Format TV show data
function formatShowData(show, index = 0) {
  if (!show) return null;
  
  // Log the raw show data to debug
  console.log('Raw show data in formatter:', JSON.stringify(show, null, 2));
  
  // Create a truly unique ID by combining any available ID with index
  const uniqueId = show.ids?.simkl || show.show_id || show.id || `show-${index}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle different API response formats
  // Sometimes the data is nested under 'show' property
  const showData = show.show || show;
  
  // Extract title with enhanced handling of different API response formats
  // Simkl API can return title in different places depending on the endpoint
  let title = null;
  
  // Try different possible locations for the title
  if (showData.title) {
    title = showData.title;
    console.log('Found show title directly in showData.title:', title);
  } else if (show.title) {
    title = show.title;
    console.log('Found show title in show.title:', title);
  } else if (show.show && show.show.title) {
    title = show.show.title;
    console.log('Found show title in show.show.title:', title);
  } else if (showData.name) {
    title = showData.name;
    console.log('Found show title in showData.name:', title);
  } else if (showData.ids && showData.ids.slug) {
    // Try to extract title from slug if available
    const titleFromSlug = showData.ids.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    title = titleFromSlug;
    console.log('Extracted show title from slug:', title);
  } else {
    // If we still don't have a title, use a fixed placeholder with ID
    title = `Show ${uniqueId}`;
    console.log('No show title found, using ID-based placeholder');
  }
  
  // Extract release date safely with more fallbacks
  let releaseDate = null;
  if (showData.released) {
    releaseDate = showData.released;
  } else if (show.released) {
    releaseDate = show.released;
  } else if (showData.first_aired) {
    releaseDate = showData.first_aired;
  } else if (show.first_aired) {
    releaseDate = show.first_aired;
  } else if (showData.year) {
    releaseDate = `${showData.year}-01-01`; // Default to January 1st of the year
  } else if (show.year) {
    releaseDate = `${show.year}-01-01`;
  } else if (showData.date) {
    releaseDate = showData.date;
  } else if (show.date) {
    releaseDate = show.date;
  }
  
  // Extract overview safely with more fallbacks
  const overview = showData.overview || show.overview || showData.description || show.description || '';
  
  // Extract genres safely
  let genres = [];
  if (Array.isArray(showData.genres)) {
    genres = showData.genres.map((genre, idx) => ({
      id: `${uniqueId}-genre-${idx}`,
      name: genre
    }));
  } else if (typeof showData.genres === 'object' && showData.genres !== null) {
    // Handle case where genres might be an object
    genres = Object.keys(showData.genres).map((key, idx) => ({
      id: `${uniqueId}-genre-${idx}`,
      name: key
    }));
  }
  
  // Extract cast safely
  let cast = [];
  if (Array.isArray(showData.cast)) {
    cast = showData.cast.map((person, idx) => ({
      id: `${uniqueId}-cast-${idx}`,
      name: person.name || 'Unknown Actor',
      character: person.character || '',
      profileUrl: person.image ? getImageUrl(person.image, 'people') : null
    }));
  }
  
  // Extract poster and backdrop URLs safely with more fallbacks
  const posterPath = showData.poster || show.poster || (showData.images && showData.images.poster) || (show.images && show.images.poster) || '';
  const backdropPath = showData.fanart || show.fanart || (showData.images && showData.images.fanart) || (show.images && show.images.fanart) || '';
  
  // Extract additional metadata
  const status = showData.status || show.status || '';
  const network = showData.network || show.network || '';
  const trailer = showData.trailer || show.trailer || '';
  const runtime = showData.runtime || show.runtime || 0;
  const voteAverage = showData.ratings?.simkl?.rating || show.ratings?.simkl?.rating || 0;
  const voteCount = showData.ratings?.simkl?.votes || show.ratings?.simkl?.votes || 0;
  const year = showData.year || show.year || (releaseDate ? new Date(releaseDate).getFullYear() : null);
  
  return {
    id: uniqueId,
    title: title,
    overview: overview,
    posterUrl: posterPath ? getImageUrl(posterPath, 'posters') : null,
    backdropUrl: backdropPath ? getImageUrl(backdropPath, 'fanart', '_medium') : null,
    releaseDate: releaseDate,
    voteAverage: voteAverage,
    voteCount: voteCount,
    popularity: showData.ratings?.simkl?.rank || 9999,
    genres: genres,
    cast: cast,
    runtime: runtime,
    year: year,
    type: 'tv',
    status: status,
    network: network,
    trailer: trailer,
    numberOfSeasons: showData.total_seasons || 0,
    numberOfEpisodes: showData.total_episodes || 0,
    // Store original IDs for reference
    ids: showData.ids || show.ids || {}
  };
}

// Get popular movies
async function getPopularMovies(page = 1) {
  const data = await fetchFromSimkl('/movies/trending/', { page, limit: 20 });
  return {
    page,
    results: data.map((movie, index) => formatMovieData(movie, index)),
    totalPages: 10, // Simkl doesn't always provide total pages
    totalResults: 200, // Approximate
  };
}

// Get trending shows
async function getTrendingShows(page = 1) {
  const data = await fetchFromSimkl('/tv/trending/', { page, limit: 20 });
  return {
    page,
    results: data.map((show, index) => formatShowData(show, index)),
    totalPages: 10,
    totalResults: 200,
  };
}

// Get movie details
async function getMovieDetails(id) {
  const data = await fetchFromSimkl(`/movies/summary`, { simkl: id, extended: 'full' });
  return formatMovieData(data);
}

// Get show details
async function getShowDetails(id) {
  const data = await fetchFromSimkl(`/tv/summary`, { simkl: id, extended: 'full' });
  const showData = formatShowData(data);
  
  // Get episodes if available
  try {
    const episodesData = await fetchFromSimkl(`/tv/episodes`, { simkl: id, extended: 'full' });
    showData.episodes = episodesData;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    showData.episodes = [];
  }
  
  return showData;
}

// Search for movies and shows
async function searchMedia(query, page = 1) {
  const data = await fetchFromSimkl('/search/text', { q: query, page, limit: 20 });
  
  const results = data.map((item, index) => {
    if (item.type === 'movie') {
      return formatMovieData(item, index);
    } else {
      return formatShowData(item, index);
    }
  });
  
  return {
    page,
    results,
    totalPages: 10,
    totalResults: results.length * 10,
  };
}

export {
  fetchFromSimkl,
  getImageUrl,
  formatMovieData,
  formatShowData,
  getPopularMovies,
  getTrendingShows,
  getMovieDetails,
  getShowDetails,
  searchMedia,
};

// lib/openLibraryApi.js - Open Library API functions for fetching book data
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_OPEN_LIBRARY_API_BASE_URL || 'https://openlibrary.org';

/**
 * Format Open Library book object
 */
function formatBook(book) {
  return {
    id: book.key?.replace('/works/', '') || Math.random().toString(36).substring(2),
    title: book.title || 'Unknown Title',
    description: book.first_sentence?.[0] || book.subtitle || 'No description available',
    author: book.author_name?.[0] || 'Unknown Author',
    coverUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : '/placeholder.svg',
    year: book.first_publish_year || 'Unknown Year',
    genre: book.subject?.[0] || 'Fiction', // Adjust if Open Library provides more specific genre data
  };
}

/**
 * Get trending books — based on 'bestsellers' keyword
 */
export const getTrendingBooks = async () => {
  const { data } = await axios.get(`${BASE_URL}/search.json`, {
    params: {
      q: 'bestsellers',
      sort: 'rating',
      limit: 20
    }
  });

  return data.docs.map(formatBook);
};

/**
 * Get classic books — based on 'classics' keyword
 */
export const getClassicBooks = async () => {
  const { data } = await axios.get(`${BASE_URL}/search.json`, {
    params: {
      q: 'classics',
      sort: 'editions',
      limit: 20
    }
  });

  return data.docs.map(formatBook);
};

/**
 * Optional: Get popular books — based on 'popular' keyword (could be same as classic)
 */
export const getPopularBooks = async () => {
  const { data } = await axios.get(`${BASE_URL}/search.json`, {
    params: {
      q: 'popular books',
      sort: 'editions',
      limit: 20
    }
  });

  return data.docs.map(formatBook);
};

/**
 * Get a book by its Work ID (e.g. OL12345W)
 */
export const getBookById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/works/${id}.json`);

  return {
    id,
    title: data.title || 'Unknown Title',
    description: typeof data.description === 'object'
      ? data.description?.value
      : data.description || 'No description available',
    author: 'Unknown Author', // Optional: You could fetch /authors separately if needed
    year: data.created?.value?.slice(0, 4) || 'Unknown Year',
    genre: data.subjects?.[0] || 'Fiction',
    coverUrl: data.covers?.length
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : '/placeholder.svg',
  };
};

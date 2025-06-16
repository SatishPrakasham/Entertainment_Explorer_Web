export async function getBooks(query = '', type = 'trending') {
  try {
    let searchUrl;
    
    // For trending books, fetch recent books
    if (!query && type === 'trending') {
      searchUrl = 'https://openlibrary.org/search.json?q=subject:fiction&has_fulltext=true&sort=first_publish_date+desc';
    }
    // For popular books, fetch books with high ratings
    else if (!query && type === 'popular') {
      searchUrl = 'https://openlibrary.org/search.json?q=subject:best+books&has_fulltext=true&sort=first_publish_date+desc';
    }
    // For search, use the search endpoint
    else if (query) {
      searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Open Library data to match our expected format
    const books = data.docs?.map(book => ({
      id: book.key,
      _id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Unknown',
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/placeholder.svg?height=300&width=200',
      imageUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/placeholder.svg?height=300&width=200',
      firstPublishYear: book.first_publish_year || 'Unknown',
      type: book.subjects?.[0] || 'Fiction',
      genre: book.subjects?.[0] || 'Fiction',
      description: book.description?.value || 'No description available'
    })) || [];

    // For trending and popular, sort by publish year (newest first)
    if (!query) {
      books.sort((a, b) => (b.firstPublishYear || 0) - (a.firstPublishYear || 0));
    }

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

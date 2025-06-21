import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// Helper function to clean undefined values from an object
function cleanObject(obj) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

/**
 * Add an item to user's My List
 * @param {string} userId - The user's UID
 * @param {Object} item - The item to add (movie, book, or song)
 * @param {string} category - 'movies', 'books', or 'songs'
 */
export async function addToMyList(userId, item, category) {
  try {
    console.log('myListService: addToMyList called with:', { userId, itemId: item.id, category });
    
    // Check if item already exists
    const exists = await isInMyList(userId, item.id, category);
    if (exists) {
      throw new Error('Item already exists in your list');
    }

    // Clean the item object to remove undefined values
    const cleanedItem = cleanObject(item);

    const docData = {
      userId,
      itemId: item.id,
      category,
      item: cleanedItem,
      addedAt: new Date()
    };

    console.log('myListService: About to save document:', { userId: docData.userId, itemId: docData.itemId, category: docData.category });

    const docRef = await addDoc(collection(db, 'myList'), docData);
    console.log('myListService: Item added to My List with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('myListService: Error adding to My List:', error);
    throw error;
  }
}

/**
 * Remove an item from user's My List
 * @param {string} userId - The user's UID
 * @param {string} itemId - The item's ID
 * @param {string} category - 'movies', 'books', or 'songs'
 */
export async function removeFromMyList(userId, itemId, category) {
  try {
    const myListRef = collection(db, 'myList');
    
    const q = query(
      myListRef,
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Item not found in your list');
    }
    
    // Delete all matching documents (should be only one)
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error removing from My List:', error);
    throw error;
  }
}

/**
 * Get user's My List items by category
 * @param {string} userId - The user's UID
 * @param {string} category - 'movies', 'books', 'songs', or 'all'
 */
export async function getMyList(userId, category = 'all') {
  try {
    const myListRef = collection(db, 'myList');
    
    let q;
    if (category === 'all') {
      q = query(
        myListRef,
        where('userId', '==', userId)
      );
    } else {
      q = query(
        myListRef,
        where('userId', '==', userId),
        where('category', '==', category)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by addedAt on the client side to avoid index requirements
    const sortedItems = items.sort((a, b) => {
      const aDate = a.addedAt?.toDate?.() || a.addedAt || new Date(0);
      const bDate = b.addedAt?.toDate?.() || b.addedAt || new Date(0);
      return bDate - aDate; // Descending order (newest first)
    });
    
    if (category === 'all') {
      // Group by category
      return {
        movies: sortedItems.filter(item => item.category === 'movies'),
        books: sortedItems.filter(item => item.category === 'books'),
        songs: sortedItems.filter(item => item.category === 'songs')
      };
    }
    
    return sortedItems;
  } catch (error) {
    console.error('Error fetching My List:', error);
    throw error;
  }
}

/**
 * Check if an item is in user's My List
 * @param {string} userId - The user's UID
 * @param {string} itemId - The item's ID
 * @param {string} category - 'movies', 'books', or 'songs'
 */
export async function isInMyList(userId, itemId, category) {
  try {
    const myListRef = collection(db, 'myList');
    
    const q = query(
      myListRef,
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking My List:', error);
    return false;
  }
}

/**
 * Get appropriate subtitle for different item types
 */
function getItemSubtitle(item, category) {
  switch (category) {
    case 'movies':
      return item.director || item.genres?.[0]?.name || 'Movie';
    case 'books':
      return item.author || item.authors?.[0] || 'Book';
    case 'songs':
      return item.artist?.name || item.artist || 'Song';
    default:
      return '';
  }
}

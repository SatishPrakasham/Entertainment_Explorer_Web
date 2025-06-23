import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addToMyList, removeFromMyList, isInMyList } from '@/lib/myListService';
import { toast } from 'sonner';

export function useMyList() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const addItem = async (item, category) => {
    if (!user) {
      toast.error('Please sign in to add items to your list');
      return false;
    }

    console.log('useMyList: Adding item for user:', { userId: user.uid, user, item: item.id, category });

    try {
      setIsLoading(true);
      await addToMyList(user.uid, item, category);
      toast.success(`Added to your ${category} list!`);
      return true;
    } catch (error) {
      console.error('useMyList: Error adding item:', error);
      if (error.message.includes('already exists')) {
        toast.error('Item is already in your list');
      } else {
        toast.error('Failed to add item to your list');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId, category) => {
    if (!user) {
      toast.error('Please sign in to manage your list');
      return false;
    }

    try {
      setIsLoading(true);
      await removeFromMyList(user.uid, itemId, category);
      toast.success('Removed from your list');
      return true;
    } catch (error) {
      toast.error('Failed to remove item from your list');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsInList = async (itemId, category) => {
    if (!user) return false;
    
    try {
      return await isInMyList(user.uid, itemId, category);
    } catch (error) {
      console.error('Error checking if item is in list:', error);
      return false;
    }
  };

  return {
    addItem,
    removeItem,
    checkIsInList,
    isLoading,
    isSignedIn: !!user
  };
}

"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getMyList, removeFromMyList } from '@/lib/myListService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Play, BookOpen, Music, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myList, setMyList] = useState({
    movies: [],
    books: [],
    songs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?from=/my-list');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMyList();
    }
  }, [user]);

  const fetchMyList = async () => {
    try {
      setIsLoading(true);
      const data = await getMyList(user.uid);
      setMyList(data);
    } catch (error) {
      console.error('Error fetching My List:', error);
      toast.error('Failed to load your list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId, category) => {
    try {
      await removeFromMyList(user.uid, itemId, category);
      
      // Update local state
      setMyList(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.itemId !== itemId)
      }));
      
      toast.success('Item removed from your list');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const getTotalCount = () => {
    return myList.movies.length + myList.books.length + myList.songs.length;
  };

  const getItemsByCategory = (category) => {
    switch (category) {
      case 'movies':
        return myList.movies;
      case 'books':
        return myList.books;
      case 'songs':
        return myList.songs;
      case 'all':
        return [
          ...myList.movies.map(item => ({ ...item, categoryType: 'movies' })),
          ...myList.books.map(item => ({ ...item, categoryType: 'books' })),
          ...myList.songs.map(item => ({ ...item, categoryType: 'songs' }))
        ].sort((a, b) => new Date(b.addedAt?.toDate()) - new Date(a.addedAt?.toDate()));
      default:
        return [];
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'movies':
        return <Play className="h-4 w-4" />;
      case 'books':
        return <BookOpen className="h-4 w-4" />;
      case 'songs':
        return <Music className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getItemLink = (item, category) => {
    const cat = category || item.categoryType;
    switch (cat) {
      case 'movies':
        return `/movies/${item.itemId}`;
      case 'books':
        return `/books/${item.itemId}`;
      case 'songs':
        return `/music/${item.itemId}`;
      default:
        return '#';
    }
  };

  // Show loading spinner while checking auth
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">My List</h1>
          </div>
          <p className="text-muted-foreground">
            {getTotalCount() === 0 
              ? "Your personal collection is empty. Start adding your favorites!"
              : `${getTotalCount()} items in your collection`
            }
          </p>
        </div>

        {getTotalCount() === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Your list is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your personal collection by adding movies, books, and songs you love.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/movies">
                <Button variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Browse Movies
                </Button>
              </Link>
              <Link href="/books">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse Books
                </Button>
              </Link>
              <Link href="/music">
                <Button variant="outline" className="gap-2">
                  <Music className="h-4 w-4" />
                  Browse Music
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <Heart className="h-4 w-4" />
                All ({getTotalCount()})
              </TabsTrigger>
              <TabsTrigger value="movies" className="gap-2">
                <Play className="h-4 w-4" />
                Movies ({myList.movies.length})
              </TabsTrigger>
              <TabsTrigger value="books" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Books ({myList.books.length})
              </TabsTrigger>
              <TabsTrigger value="songs" className="gap-2">
                <Music className="h-4 w-4" />
                Songs ({myList.songs.length})
              </TabsTrigger>
            </TabsList>

            {['all', 'movies', 'books', 'songs'].map(category => (
              <TabsContent key={category} value={category} className="mt-6">
                <ItemGrid 
                  items={getItemsByCategory(category)}
                  category={category}
                  onRemove={handleRemoveItem}
                  getCategoryIcon={getCategoryIcon}
                  getItemLink={getItemLink}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function ItemGrid({ items, category, onRemove, getCategoryIcon, getItemLink }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          {getCategoryIcon(category)}
        </div>
        <p className="text-muted-foreground">
          No {category === 'all' ? 'items' : category} in your list yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <AnimatePresence>
        {items.map((listItem) => (
          <motion.div
            key={`${listItem.category || listItem.categoryType}-${listItem.itemId}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ItemCard 
              listItem={listItem}
              category={category}
              onRemove={onRemove}
              getCategoryIcon={getCategoryIcon}
              getItemLink={getItemLink}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ItemCard({ listItem, category, onRemove, getCategoryIcon, getItemLink }) {
  const item = listItem.item;
  const itemCategory = listItem.category || listItem.categoryType;
  
  // Helper function to get the correct image URL for different item types
  const getImageUrl = (item, category) => {
    // Check all possible image field names based on item type
    const imageFields = [
      'posterUrl',    // Movies
      'coverUrl',     // Books, Music
      'image',        // Generic
      'albumArt',     // Music albums
      'thumbnail'     // Fallback
    ];
    
    for (const field of imageFields) {
      if (item[field]) {
        return item[field];
      }
    }
    
    return "/placeholder.svg?height=300&width=200";
  };
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative aspect-[2/3]">
        <Link href={getItemLink(listItem, itemCategory)}>
          <Image
            src={getImageUrl(item, itemCategory)}
            alt={item.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
            {getCategoryIcon(itemCategory)}
            {itemCategory}
          </div>
        </div>

        {/* Remove button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0"
            onClick={() => onRemove(listItem.itemId, itemCategory)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={getItemLink(listItem, itemCategory)}>
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {item.subtitle}
        </p>
        
        {item.year && (
          <p className="text-xs text-muted-foreground">
            {new Date(item.year).getFullYear ? new Date(item.year).getFullYear() : item.year}
          </p>
        )}
        
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Added {listItem.addedAt?.toDate ? 
            listItem.addedAt.toDate().toLocaleDateString() : 
            'Recently'
          }
        </div>
      </CardContent>
    </Card>
  );
}

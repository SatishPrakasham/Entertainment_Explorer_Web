"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Loader2 } from 'lucide-react';
import { useMyList } from '@/hooks/useMyList';

export function AddToListButton({ 
  item, 
  category, 
  variant = "outline", 
  size = "sm",
  className = "",
  showText = true 
}) {
  const { addItem, removeItem, checkIsInList, isLoading, isSignedIn } = useMyList();
  const [isInList, setIsInList] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isSignedIn && item?.id) {
      checkItemStatus();
    }
  }, [isSignedIn, item?.id, category]);

  const checkItemStatus = async () => {
    setChecking(true);
    try {
      const inList = await checkIsInList(item.id, category);
      setIsInList(inList);
    } finally {
      setChecking(false);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      // You could redirect to login or show a modal here
      return;
    }

    if (isInList) {
      const success = await removeItem(item.id, category);
      if (success) {
        setIsInList(false);
      }
    } else {
      const success = await addItem(item, category);
      if (success) {
        setIsInList(true);
      }
    }
  };

  if (checking) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {showText && <span className="ml-1">...</span>}
      </Button>
    );
  }

  return (
    <Button 
      variant={isInList ? "default" : variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isInList ? (
        <Check className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-1">
          {isInList ? 'In List' : 'Add'}
        </span>
      )}
    </Button>
  );
}

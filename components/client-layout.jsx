'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { PageTransition } from '@/components/ui/page-transition';

export function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <PageTransition>
          {children}
        </PageTransition>
      )}
    </>
  );
}

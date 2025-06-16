'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './logo';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background ${
        loading ? 'block' : 'pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center">
        <Logo size="xl" animate={loading} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Loading amazing content...  
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="h-1 bg-primary mt-4 rounded-full"
        />
      </div>
    </motion.div>
  );
}

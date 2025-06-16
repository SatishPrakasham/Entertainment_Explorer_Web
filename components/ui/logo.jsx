'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function Logo({ size = 'md', animate = true }) {
  // Size variants
  const sizes = {
    sm: { container: 'h-8 w-8', icon: 'h-4 w-4' },
    md: { container: 'h-12 w-12', icon: 'h-6 w-6' },
    lg: { container: 'h-16 w-16', icon: 'h-8 w-8' },
    xl: { container: 'h-24 w-24', icon: 'h-12 w-12' },
  };

  // Animation variants
  const containerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ...(animate && { 
          scale: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5
          }
        })
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 8px rgba(var(--primary-rgb), 0.5)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    initial: { rotate: -10, opacity: 0.8 },
    animate: { 
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ...(animate && { 
          rotate: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.2
          }
        })
      }
    }
  };

  return (
    <div className="flex items-center">
      <motion.div
        className={`${sizes[size].container} bg-primary rounded-lg flex items-center justify-center`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate="animate"
        >
          <Play className={`${sizes[size].icon} text-primary-foreground`} />
        </motion.div>
      </motion.div>
      <motion.span 
        className="ml-2 font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Entertainment Explorer
      </motion.span>
    </div>
  );
}

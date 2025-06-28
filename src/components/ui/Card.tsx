import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer' : '';
  
  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ 
          y: -4, 
          scale: 1.02,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`${baseClasses} ${hoverClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};
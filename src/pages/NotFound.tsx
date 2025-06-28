import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-9xl font-bold text-primary-700 dark:text-primary-400"
        >
          404
        </motion.h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link to="/">
            <Button className="inline-flex items-center">
              <Home size={18} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="inline-flex items-center">
              <ArrowLeft size={18} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const CircularProgressChart: React.FC = () => {
  const progressData = [
    { label: 'Monthly Goal', value: 75, color: '#10B981', icon: Target },
    { label: 'Revenue Growth', value: 85, color: '#1E3A8A', icon: TrendingUp },
    { label: 'Days Active', value: 92, color: '#F59E0B', icon: Calendar },
  ];

  const CircularProgress = ({ value, color, size = 120 }: { value: number; color: string; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <motion.div 
        className="relative" 
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {value}%
          </motion.span>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="p-6 h-full hover:shadow-xl transition-all duration-300">
      <motion.h3 
        className="text-lg font-semibold text-gray-900 dark:text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Progress Overview
      </motion.h3>
      <div className="grid grid-cols-1 gap-6">
        {progressData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={item.label} 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                x: 10,
                transition: { duration: 0.2 }
              }}
            >
              <CircularProgress value={item.value} color={item.color} size={80} />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={16} style={{ color: item.color }} />
                  </motion.div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    whileHover={{ 
                      boxShadow: `0 0 20px ${item.color}`,
                      transition: { duration: 0.2 }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default CircularProgressChart;
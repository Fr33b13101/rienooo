import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DashboardSummary, ChartData, MonthlyComparison } from '../types';
import { TrendingUp, Flame, ArrowUpRight, Plus, DollarSign, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CircularProgressChart from '../components/charts/CircularProgressChart';

// Mock data for demo purposes with elegant green theme
const mockSummary: DashboardSummary = {
  totalRevenue: 45000,
  totalProfit: 32000,
  amountOwed: 8500,
  amountYouOwe: 2300,
  dailyStreak: 12
};

const mockRevenueData: ChartData[] = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 3000) + 1000,
  profit: Math.floor(Math.random() * 2000) + 500
}));

const DashboardMain = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [summary] = useState<DashboardSummary>(mockSummary);
  const [revenueData] = useState<ChartData[]>(mockRevenueData);
  const [monthlyComparison] = useState<MonthlyComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load demo entries from localStorage
  useEffect(() => {
    const loadDemoEntries = () => {
      try {
        const savedEntries = localStorage.getItem('demo_entries');
        if (savedEntries) {
          const parsedEntries = JSON.parse(savedEntries);
          setEntries(parsedEntries.slice(0, 3)); // Show only first 3
        } else {
          // Default demo entries if none exist
          const defaultEntries = [
            { id: 1, productOrService: 'Website Design', revenue: 2500, cost: 500, profit: 2000 },
            { id: 2, productOrService: 'Logo Design', revenue: 800, cost: 100, profit: 700 },
            { id: 3, productOrService: 'Consulting', revenue: 1200, cost: 0, profit: 1200 },
          ];
          setEntries(defaultEntries as any);
        }
      } catch (error) {
        console.error('Error loading demo entries:', error);
        // Fallback to default entries
        const defaultEntries = [
          { id: 1, productOrService: 'Website Design', revenue: 2500, cost: 500, profit: 2000 },
          { id: 2, productOrService: 'Logo Design', revenue: 800, cost: 100, profit: 700 },
          { id: 3, productOrService: 'Consulting', revenue: 1200, cost: 0, profit: 1200 },
        ];
        setEntries(defaultEntries as any);
      }
    };

    loadDemoEntries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 animate-fade-in">
      <div className="flex items-center justify-between w-full">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Financial Overview
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/60 dark:bg-gray-700/60 px-3 py-1 rounded-full backdrop-blur-sm hover:bg-gray-200/60 dark:hover:bg-gray-600/60 transition-colors cursor-default"
        >
          Demo Mode - Sample Data
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white p-6 rounded-xl shadow-lg cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <motion.div 
              className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <TrendingUp size={20} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(summary.totalProfit)}</p>
            </div>
            <motion.div 
              className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Amount Owed To You</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(summary.amountOwed)}</p>
            </div>
            <motion.div 
              className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <DollarSign size={20} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Amount You Owe</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(summary.amountYouOwe)}</p>
            </div>
            <motion.div 
              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <CreditCard size={20} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Daily Streak</p>
              <p className="text-2xl font-bold mt-2">{summary.dailyStreak} days</p>
            </div>
            <motion.div 
              className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <Flame size={20} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row - Fixed height to prevent shrinking */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={chartVariants}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Revenue & Profit Over Time - Fixed minimum height */}
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col w-full min-h-[400px]"
          whileHover={{ 
            y: -4, 
            scale: 1.02,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            Revenue & Profit Over Time
            <span className="ml-2 text-xs py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {revenueData.length} days
            </span>
          </h3>
          <div className="flex-1 w-full" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                <YAxis 
                  tickFormatter={(value) => `$${value > 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `Day: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#166534"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#166534' }}
                  activeDot={{ r: 6, fill: '#166534' }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22C55E' }}
                  activeDot={{ r: 6, fill: '#22C55E' }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Circular Progress Chart - Fixed minimum height */}
        <motion.div 
          className="flex flex-col w-full min-h-[400px]"
          whileHover={{ 
            y: -4,
            transition: { duration: 0.2 }
          }}
        >
          <CircularProgressChart />
        </motion.div>
      </motion.div>

      {/* Recent Entries Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Entries</h3>
          <button
            onClick={() => navigate('/dashboard/add-entry')}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
          >
            View All
          </button>
        </div>
        
        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.slice(0, 3).map((entry: any) => (
              <motion.div 
                key={entry.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{entry.productOrService}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue: ${entry.revenue} • Cost: ${entry.cost}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">${entry.profit || (entry.revenue - entry.cost)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No entries yet</p>
            <button
              onClick={() => navigate('/dashboard/add-entry')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Entry
            </button>
          </div>
        )}
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => navigate('/dashboard/add-entry')}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out group"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: 'auto'
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="h-5 w-5" />
        </motion.div>
        <motion.span 
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: 'auto', opacity: 1 }}
          className="overflow-hidden whitespace-nowrap"
        >
          Add Entry
        </motion.span>
      </motion.button>
    </div>
  );
};

export default DashboardMain;
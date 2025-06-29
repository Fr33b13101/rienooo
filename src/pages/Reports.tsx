import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Category, Entry } from '../types';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { isDemoMode, getDemoMonthlyData, getDemoCategoryData, getDemoEntries, getDemoCategories, simulateApiDelay } from '../lib/demoService';

interface MonthlySummary {
  month: string;
  year: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  entryCount: number;
  categories: {
    [categoryName: string]: {
      revenue: number;
      cost: number;
      profit: number;
      count: number;
      color: string;
    };
  };
}

interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

const Reports = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'6months' | '12months' | 'all'>('6months');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        if (isDemoMode()) {
          // Load demo data
          await simulateApiDelay(600);
          
          const demoEntries = getDemoEntries();
          const demoCategories = getDemoCategories();
          const demoMonthlyData = getDemoMonthlyData();
          
          setEntries(demoEntries);
          setCategories(demoCategories);
          
          // Convert demo monthly data to the expected format
          const summaries = demoMonthlyData.map((monthData, index) => ({
            month: monthData.month,
            year: 2024,
            totalRevenue: monthData.revenue,
            totalCost: monthData.cost,
            totalProfit: monthData.profit,
            entryCount: monthData.entries,
            categories: {}
          }));
          
          setMonthlySummaries(summaries);
        } else {
          // Fetch real data from Supabase
          const [entriesResponse, categoriesResponse] = await Promise.all([
            supabase
              .from('entries')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false }),
            supabase
              .from('categories')
              .select('*')
              .eq('user_id', user.id)
          ]);

          if (entriesResponse.error) throw entriesResponse.error;
          if (categoriesResponse.error) throw categoriesResponse.error;
          
          const fetchedEntries = entriesResponse.data || [];
          const fetchedCategories = categoriesResponse.data || [];
          
          setEntries(fetchedEntries);
          setCategories(fetchedCategories);
          
          // Generate monthly summaries
          const summaries = generateMonthlySummaries(fetchedEntries, fetchedCategories);
          setMonthlySummaries(summaries);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('error', 'Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, addToast]);

  const generateMonthlySummaries = (entries: Entry[], categories: Category[]): MonthlySummary[] => {
    if (entries.length === 0) return [];

    // Create a map of category IDs to category objects for quick lookup
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);

    // Group entries by month
    const monthlyData: Record<string, MonthlySummary> = {};

    entries.forEach((entry) => {
      const entryDate = parseISO(entry.date);
      const monthKey = format(entryDate, 'yyyy-MM');
      const monthName = format(entryDate, 'MMM yyyy');
      const year = entryDate.getFullYear();

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          year,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          entryCount: 0,
          categories: {},
        };
      }

      const summary = monthlyData[monthKey];
      const category = categoryMap[entry.categoryId];
      const categoryName = category?.name || 'Uncategorized';
      const categoryColor = category?.color || '#6B7280';

      // Update monthly totals
      summary.totalRevenue += entry.revenue;
      summary.totalCost += entry.cost;
      summary.totalProfit += (entry.revenue - entry.cost);
      summary.entryCount += 1;

      // Update category totals within the month
      if (!summary.categories[categoryName]) {
        summary.categories[categoryName] = {
          revenue: 0,
          cost: 0,
          profit: 0,
          count: 0,
          color: categoryColor,
        };
      }

      summary.categories[categoryName].revenue += entry.revenue;
      summary.categories[categoryName].cost += entry.cost;
      summary.categories[categoryName].profit += (entry.revenue - entry.cost);
      summary.categories[categoryName].count += 1;
    });

    // Convert to array and sort by date (newest first)
    return Object.values(monthlyData).sort((a, b) => 
      new Date(b.year, parseInt(b.month.split(' ')[0]) - 1).getTime() - 
      new Date(a.year, parseInt(a.month.split(' ')[0]) - 1).getTime()
    );
  };

  const getFilteredSummaries = () => {
    if (selectedPeriod === 'all') return monthlySummaries;
    
    const monthsToShow = selectedPeriod === '6months' ? 6 : 12;
    return monthlySummaries.slice(0, monthsToShow);
  };

  const getChartData = () => {
    return getFilteredSummaries().reverse().map(summary => ({
      month: summary.month,
      revenue: summary.totalRevenue,
      cost: summary.totalCost,
      profit: summary.totalProfit,
    }));
  };

  const getCategoryData = (): CategorySummary[] => {
    if (isDemoMode()) {
      return getDemoCategoryData();
    }
    
    const categoryTotals: Record<string, { value: number; color: string }> = {};
    
    getFilteredSummaries().forEach(summary => {
      Object.entries(summary.categories).forEach(([categoryName, data]) => {
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = { value: 0, color: data.color };
        }
        categoryTotals[categoryName].value += data.revenue;
      });
    });

    return Object.entries(categoryTotals)
      .map(([name, data]) => ({ name, value: data.value, color: data.color }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const exportToCSV = () => {
    const csvData = getFilteredSummaries().map(summary => ({
      Month: summary.month,
      'Total Revenue': summary.totalRevenue,
      'Total Cost': summary.totalCost,
      'Total Profit': summary.totalProfit,
      'Entry Count': summary.entryCount,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    addToast('success', isDemoMode() ? 'Demo report exported' : 'Report exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0 && !isDemoMode()) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No data to report</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding entries to see your financial reports and insights.
            </p>
            <a
              href="/dashboard/add-entry"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Calendar size={18} />
              Add Your First Entry
            </a>
          </div>
        </div>
      </div>
    );
  }

  const filteredSummaries = getFilteredSummaries();
  const chartData = getChartData();
  const categoryData = getCategoryData();

  // Calculate overall totals
  const overallTotals = filteredSummaries.reduce(
    (acc, summary) => ({
      revenue: acc.revenue + summary.totalRevenue,
      cost: acc.cost + summary.totalCost,
      profit: acc.profit + summary.totalProfit,
      entries: acc.entries + summary.entryCount,
    }),
    { revenue: 0, cost: 0, profit: 0, entries: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monthly summaries and insights into your financial performance.
            {isDemoMode() && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                (Demo Mode - sample data)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="input py-2"
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(overallTotals.revenue)}</p>
            </div>
            <TrendingUp size={24} className="text-primary-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Costs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(overallTotals.cost)}</p>
            </div>
            <TrendingDown size={24} className="text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Profit</p>
              <p className={`text-2xl font-bold mt-2 ${overallTotals.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(overallTotals.profit)}
              </p>
            </div>
            <BarChart3 size={24} className={overallTotals.profit >= 0 ? 'text-green-500' : 'text-red-500'} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{overallTotals.entries}</p>
            </div>
            <Calendar size={24} className="text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue vs Cost Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue vs Cost Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                <YAxis 
                  tickFormatter={(value) => `$${value > 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="#EF4444" name="Cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#3B82F6" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          
          </div>
        </motion.div>
      </div>

      {/* Monthly Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card overflow-hidden"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Entries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Profit Margin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSummaries.map((summary, index) => {
                const profitMargin = summary.totalRevenue > 0 ? (summary.totalProfit / summary.totalRevenue) * 100 : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {summary.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(summary.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(summary.totalCost)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      summary.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(summary.totalProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {summary.entryCount}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {profitMargin.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
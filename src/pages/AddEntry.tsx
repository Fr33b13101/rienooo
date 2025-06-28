import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Category } from '../types';
import { Save, Calendar, DollarSign, Tag, FileText, Plus } from 'lucide-react';
import FullscreenModal from '../components/ui/FullscreenModal';
import { motion } from 'framer-motion';

interface EntryForm {
  date: string;
  productOrService: string;
  revenue: number;
  cost: number;
  categoryId: string;
  notes: string;
}

// Demo categories data
const demoCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Consulting',
    type: 'income',
    color: '#10B981',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Design Work',
    type: 'income',
    color: '#3B82F6',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Development',
    type: 'income',
    color: '#8B5CF6',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Office Supplies',
    type: 'expense',
    color: '#F59E0B',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Software',
    type: 'expense',
    color: '#EF4444',
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
  },
];

const AddEntry = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form state with default values set to 0
  const [formData, setFormData] = useState<EntryForm>({
    date: new Date().toISOString().split('T')[0],
    productOrService: '',
    revenue: 0,
    cost: 0,
    categoryId: '',
    notes: '',
  });

  // Calculate profit
  const profit = formData.revenue - formData.cost;

  useEffect(() => {
    // Load demo categories
    const loadDemoCategories = () => {
      try {
        // Simulate loading time
        setTimeout(() => {
          setCategories(demoCategories);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading demo categories:', error);
        addToast('error', 'Failed to load categories');
        setLoading(false);
      }
    };

    if (user) {
      loadDemoCategories();
    }
  }, [user, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'revenue' || name === 'cost' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.productOrService || !formData.categoryId) {
      addToast('error', 'Please fill in all required fields');
      return;
    }
    
    if (!user) {
      addToast('error', 'User not authenticated');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing entries from localStorage
      const existingEntries = JSON.parse(localStorage.getItem('demo_entries') || '[]');
      
      // Create new entry
      const newEntry = {
        id: 'entry-' + Date.now(),
        date: formData.date,
        productOrService: formData.productOrService,
        revenue: formData.revenue,
        cost: formData.cost,
        categoryId: formData.categoryId,
        notes: formData.notes || null,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      const updatedEntries = [newEntry, ...existingEntries];
      localStorage.setItem('demo_entries', JSON.stringify(updatedEntries));
      
      addToast('success', 'Entry added successfully');
      
      // Reset form with default values set to 0
      setFormData({
        date: new Date().toISOString().split('T')[0],
        productOrService: '',
        revenue: 0,
        cost: 0,
        categoryId: '',
        notes: '',
      });
      
      setShowModal(false);
    } catch (error) {
      console.error('Error adding entry:', error);
      addToast('error', 'Failed to add entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Entry</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Record your income and expenses to keep track of your finances.
        </p>
      </motion.div>
      
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="w-24 h-24 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: '#E0F2FE',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={48} className="text-primary-600 dark:text-primary-400" />
            </motion.div>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
          >
            Ready to add an entry?
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            Click the button below to open the entry form and record your financial transaction.
          </motion.p>
          <motion.button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={18} />
            </motion.div>
            Add Entry
          </motion.button>
        </div>
      </div>

      <FullscreenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Entry"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="date" className="label flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input hover:scale-105 transition-transform"
                  required
                />
              </motion.div>
              
              {/* Product/Service */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="productOrService" className="label flex items-center">
                  <FileText size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Product/Service
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="productOrService"
                  name="productOrService"
                  value={formData.productOrService}
                  onChange={handleChange}
                  className="input hover:scale-105 transition-transform"
                  placeholder="e.g., Website Design, Office Supplies"
                  required
                />
              </motion.div>
              
              {/* Revenue */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="revenue" className="label flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Revenue
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="revenue"
                    name="revenue"
                    value={formData.revenue || ''}
                    onChange={handleChange}
                    className="input pl-8 hover:scale-105 transition-transform"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </motion.div>
              
              {/* Cost */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="cost" className="label flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Cost
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost || ''}
                    onChange={handleChange}
                    className="input pl-8 hover:scale-105 transition-transform"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </motion.div>
              
              {/* Category */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label htmlFor="categoryId" className="label flex items-center">
                  <Tag size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="input hover:scale-105 transition-transform"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 && (
                    <>
                      <optgroup label="Income Categories">
                        {categories
                          .filter((cat) => cat.type === 'income')
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Expense Categories">
                        {categories
                          .filter((cat) => cat.type === 'expense')
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </optgroup>
                    </>
                  )}
                </select>
                {categories.length === 0 && !loading && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No categories found. <a href="/dashboard/categories" className="text-primary-600 dark:text-primary-400 hover:underline">Create one first</a>.
                  </p>
                )}
              </motion.div>
              
              {/* Profit (Calculated) */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="label flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Profit (Calculated)
                </label>
                <div className="input flex items-center bg-gray-50 dark:bg-gray-700 hover:scale-105 transition-transform">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    ${profit.toFixed(2)}
                  </span>
                  {profit > 0 ? (
                    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1 px-2 rounded-full">
                      Profit
                    </span>
                  ) : profit < 0 ? (
                    <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 py-1 px-2 rounded-full">
                      Loss
                    </span>
                  ) : (
                    <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 py-1 px-2 rounded-full">
                      Break Even
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Notes */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="notes" className="label flex items-center">
                <FileText size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input h-24 resize-none hover:scale-105 transition-transform"
                placeholder="Add any additional details or notes about this entry..."
              />
            </motion.div>
            
            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={18} />
                {submitting ? 'Saving...' : 'Save Entry'}
              </motion.button>
            </div>
          </form>
        </div>
      </FullscreenModal>
    </div>
  );
};

export default AddEntry;
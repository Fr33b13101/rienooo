import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Category } from '../types';
import { Plus, Edit, Trash, Tag, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FullscreenModal from '../components/ui/FullscreenModal';

// Available colors
const colorOptions = [
  { name: 'Blue', value: '#4338CA' },
  { name: 'Light Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
];

interface CategoryForm {
  id?: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

const Categories = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    type: 'income',
    color: colorOptions[0].value,
  });
  
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        addToast('error', 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'income',
      color: colorOptions[0].value,
    });
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color || colorOptions[0].value,
    });
    setEditingId(category.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      setDeleting(id);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCategories((prev) => prev.filter(category => category.id !== id));
      addToast('success', 'Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      addToast('error', 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      addToast('error', 'Please enter a category name');
      return;
    }
    
    if (!user) {
      addToast('error', 'User not authenticated');
      return;
    }
    
    try {
      if (editingId) {
        // Update existing category
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            type: formData.type,
            color: formData.color,
          })
          .eq('id', editingId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingId ? data : category
          )
        );
        
        addToast('success', 'Category updated successfully');
      } else {
        // Add new category
        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            type: formData.type,
            color: formData.color,
            user_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;
        
        setCategories((prev) => [...prev, data]);
        addToast('success', 'Category added successfully');
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      addToast('error', 'Failed to save category');
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Manage Categories</h2>
          <p className="text-secondary-600 mt-2">
            Create and manage categories for organizing your income and expenses.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading categories...</p>
        </div>
      ) : !hasCategories ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag size={48} className="text-primary-800" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">No categories yet</h3>
            <p className="text-secondary-600 mb-8">
              Create your first category to start organizing your financial entries.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Create First Category
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="bg-primary-50 p-2 rounded-full mr-3">
                <TrendingUp size={20} className="text-primary-800" />
              </div>
              <h3 className="text-lg font-semibold">Income Categories</h3>
            </div>
            
            <ul className="space-y-2">
              {categories
                .filter((category) => category.type === 'income')
                .map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className="font-medium text-secondary-800">{category.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-secondary-400 hover:text-primary-600 transition-colors"
                        title="Edit category"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-secondary-400 hover:text-error-600 transition-colors"
                        title="Delete category"
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? (
                          <Circle className="animate-pulse" size={18} />
                        ) : (
                          <Trash size={18} />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              
              {categories.filter((category) => category.type === 'income').length === 0 && (
                <li className="text-center py-4 text-secondary-500">
                  No income categories found.
                </li>
              )}
            </ul>
          </div>
          
          {/* Expense Categories */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="bg-error-50 p-2 rounded-full mr-3">
                <TrendingDown size={20} className="text-error-600" />
              </div>
              <h3 className="text-lg font-semibold">Expense Categories</h3>
            </div>
            
            <ul className="space-y-2">
              {categories
                .filter((category) => category.type === 'expense')
                .map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className="font-medium text-secondary-800">{category.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-secondary-400 hover:text-primary-600 transition-colors"
                        title="Edit category"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-secondary-400 hover:text-error-600 transition-colors"
                        title="Delete category"
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? (
                          <Circle className="animate-pulse" size={18} />
                        ) : (
                          <Trash size={18} />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              
              {categories.filter((category) => category.type === 'expense').length === 0 && (
                <li className="text-center py-4 text-secondary-500">
                  No expense categories found.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <FullscreenModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? 'Edit Category' : 'Add New Category'}
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="label">
                  Category Name
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Consulting, Office Supplies"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="label">
                  Type
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="color" className="label">
                  Color
                </label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="input"
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex mt-2 items-center space-x-2">
              <span className="text-sm text-secondary-600">Preview:</span>
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              ></span>
              <span
                className="px-2 py-1 rounded text-white text-xs"
                style={{ backgroundColor: formData.color }}
              >
                {formData.name || 'Category Name'}
              </span>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </FullscreenModal>
    </div>
  );
};

// Icons for categories page
const TrendingUp = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrendingDown = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);

export default Categories;
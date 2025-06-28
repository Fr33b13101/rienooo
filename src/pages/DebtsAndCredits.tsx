import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { DebtCredit } from '../types';
import { Plus, Edit, Trash, Search, Check, Clock, Circle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import FullscreenModal from '../components/ui/FullscreenModal';

interface DebtCreditForm {
  id?: string;
  name: string;
  amount: number;
  reason: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'unpaid';
  type: 'receivable' | 'payable';
}

const DebtsAndCredits = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [debtsCredits, setDebtsCredits] = useState<DebtCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentType, setCurrentType] = useState<'receivable' | 'payable'>('receivable');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  // Form state
  const [formData, setFormData] = useState<DebtCreditForm>({
    name: '',
    amount: 0,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    status: 'unpaid',
    type: 'receivable',
  });
  
  useEffect(() => {
    const fetchDebtsCredits = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('debts_credits')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date');

        if (error) throw error;
        
        setDebtsCredits(data || []);
      } catch (error) {
        console.error('Error fetching debts and credits:', error);
        addToast('error', 'Failed to load debts and credits');
      } finally {
        setLoading(false);
      }
    };

    fetchDebtsCredits();
  }, [user, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: 0,
      reason: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      type: currentType,
    });
    setEditingId(null);
  };

  const handleEdit = (item: DebtCredit) => {
    setFormData({
      id: item.id,
      name: item.name,
      amount: item.amount,
      reason: item.reason,
      date: item.date,
      dueDate: item.dueDate,
      status: item.status,
      type: item.type,
    });
    setEditingId(item.id);
    setShowModal(true);
    setCurrentType(item.type);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      setDeleting(id);
      
      const { error } = await supabase
        .from('debts_credits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setDebtsCredits((prev) => prev.filter(item => item.id !== id));
      addToast('success', 'Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      addToast('error', 'Failed to delete entry');
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.reason || !formData.date || !formData.dueDate) {
      addToast('error', 'Please fill in all required fields');
      return;
    }
    
    if (!user) {
      addToast('error', 'User not authenticated');
      return;
    }
    
    try {
      if (editingId) {
        // Update existing entry
        const { data, error } = await supabase
          .from('debts_credits')
          .update({
            name: formData.name,
            amount: formData.amount,
            reason: formData.reason,
            date: formData.date,
            due_date: formData.dueDate,
            status: formData.status,
            type: formData.type,
          })
          .eq('id', editingId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setDebtsCredits((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...data, dueDate: data.due_date } : item
          )
        );
        
        addToast('success', 'Entry updated successfully');
      } else {
        // Add new entry
        const { data, error } = await supabase
          .from('debts_credits')
          .insert([{
            name: formData.name,
            amount: formData.amount,
            reason: formData.reason,
            date: formData.date,
            due_date: formData.dueDate,
            status: formData.status,
            type: formData.type,
            user_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;
        
        setDebtsCredits((prev) => [...prev, { ...data, dueDate: data.due_date }]);
        addToast('success', 'Entry added successfully');
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      addToast('error', 'Failed to save entry');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: 'paid' | 'unpaid') => {
    if (!user) return;
    
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      
      const { error } = await supabase
        .from('debts_credits')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setDebtsCredits((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      
      addToast('success', `Marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      addToast('error', 'Failed to update status');
    }
  };

  // Filter and search
  const filteredItems = debtsCredits.filter((item) => {
    const matchesType = item.type === currentType;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalReceivable = debtsCredits
    .filter(item => item.type === 'receivable' && item.status === 'unpaid')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const totalPayable = debtsCredits
    .filter(item => item.type === 'payable' && item.status === 'unpaid')
    .reduce((sum, item) => sum + item.amount, 0);

  const hasData = debtsCredits.length > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Debts & Credits</h2>
          <p className="text-secondary-600 mt-2">
            Track who owes you money and what you owe to others.
          </p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-primary-800 to-primary-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium text-lg">Total Receivable</h3>
              <p className="text-3xl font-bold mt-2">
                ${totalReceivable.toLocaleString()}
              </p>
              <p className="text-primary-100 mt-2">
                Money owed to you
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <TrendingUp size={32} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-secondary-900 font-medium text-lg">Total Payable</h3>
              <p className="text-3xl font-bold text-secondary-900 mt-2">
                ${totalPayable.toLocaleString()}
              </p>
              <p className="text-secondary-500 mt-2">
                Money you owe to others
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-800">
              <TrendingDown size={32} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-secondary-200">
        <button
          onClick={() => {
            setCurrentType('receivable');
            setShowModal(false);
            resetForm();
          }}
          className={`py-3 px-5 font-medium text-sm ${
            currentType === 'receivable'
              ? 'text-primary-800 border-b-2 border-primary-800'
              : 'text-secondary-600 hover:text-secondary-900'
          }`}
        >
          Who Owes You
        </button>
        <button
          onClick={() => {
            setCurrentType('payable');
            setShowModal(false);
            resetForm();
          }}
          className={`py-3 px-5 font-medium text-sm ${
            currentType === 'payable'
              ? 'text-primary-800 border-b-2 border-primary-800'
              : 'text-secondary-600 hover:text-secondary-900'
          }`}
        >
          What You Owe
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading entries...</p>
        </div>
      ) : !hasData ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={48} className="text-primary-800" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">No entries yet</h3>
            <p className="text-secondary-600 mb-8">
              Start tracking your debts and credits by adding your first entry.
            </p>
            <button
              onClick={() => {
                resetForm();
                setFormData(prev => ({ ...prev, type: currentType }));
                setShowModal(true);
              }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Add First Entry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => {
                resetForm();
                setFormData(prev => ({ ...prev, type: currentType }));
                setShowModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add {currentType === 'receivable' ? 'Receivable' : 'Payable'}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 py-2"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-secondary-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                  className="input pl-10 py-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="unpaid">Unpaid Only</option>
                  <option value="paid">Paid Only</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-secondary-500">
                        No entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {item.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {format(new Date(item.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === 'paid'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}
                          >
                            {item.status === 'paid' ? (
                              <Check size={14} className="mr-1" />
                            ) : (
                              <Clock size={14} className="mr-1" />
                            )}
                            {item.status === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleStatusToggle(item.id, item.status)}
                              className={`p-1 rounded-full ${
                                item.status === 'paid' 
                                  ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200' 
                                  : 'bg-success-100 text-success-600 hover:bg-success-200'
                              }`}
                              title={item.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}
                            >
                              {item.status === 'paid' ? (
                                <Clock size={18} />
                              ) : (
                                <Check size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-full"
                              title="Edit entry"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-error-600 hover:text-error-800 hover:bg-error-50 rounded-full"
                              title="Delete entry"
                              disabled={deleting === item.id}
                            >
                              {deleting === item.id ? (
                                <Circle className="animate-pulse" size={18} />
                              ) : (
                                <Trash size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <FullscreenModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? 'Edit Entry' : `Add New ${currentType === 'receivable' ? 'Receivable' : 'Payable'}`}
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="label">
                  Name/Company
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder={currentType === 'receivable' ? "Who owes you?" : "Who you owe?"}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="label">
                  Amount
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-secondary-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    className="input pl-8"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="reason" className="label">
                  Reason/Description
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="input"
                  placeholder="What is this for?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="date" className="label">
                  Date
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dueDate" className="label">
                  Due Date
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              <input
                type="hidden"
                name="type"
                value={currentType}
              />
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
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </FullscreenModal>
    </div>
  );
};

// Icons for debts/credits page
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

export default DebtsAndCredits;
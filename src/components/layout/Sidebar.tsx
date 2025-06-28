import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  FilePlus, 
  Tags, 
  DollarSign, 
  Settings, 
  LogOut,
  BarChart4,
  User,
  X
} from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { path: '/dashboard/add-entry', icon: <FilePlus />, label: 'Add Entry' },
    { path: '/dashboard/categories', icon: <Tags />, label: 'Categories' },
    { path: '/dashboard/debts-credits', icon: <DollarSign />, label: 'Debts & Credits' },
    { path: '/dashboard/reports', icon: <BarChart4 />, label: 'Reports' },
    { path: '/dashboard/settings', icon: <Settings />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full bg-primary-900 dark:bg-primary-950 text-white z-50 lg:translate-x-0 lg:static lg:z-auto transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-800 dark:border-primary-900">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            <Logo size={collapsed ? 36 : 40} />
            {!collapsed && <span className="text-xl font-bold ml-2">Rieno</span>}
          </div>
          <div className="flex items-center space-x-2">
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-primary-800 dark:hover:bg-primary-900 transition-colors"
              >
                <X size={20} />
              </motion.button>
            )}
            <button 
              onClick={toggleSidebar} 
              className={`hidden lg:block text-white p-2 rounded-full hover:bg-primary-800 dark:hover:bg-primary-900 transition-colors ${
                collapsed ? 'rotate-180' : ''
              }`}
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-primary-700 dark:bg-primary-800 text-white shadow-lg' 
                      : 'text-primary-100 hover:bg-primary-800 dark:hover:bg-primary-900 hover:text-white hover:shadow-md hover:scale-105'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-primary-800 dark:border-primary-900">
          {!collapsed && user && (
            <div className="bg-primary-800 dark:bg-primary-900 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 dark:bg-primary-700 rounded-full p-2">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-primary-300">Free Plan</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={logout}
            className={`flex items-center p-3 rounded-lg text-primary-100 hover:bg-primary-800 dark:hover:bg-primary-900 hover:text-white transition-all duration-200 w-full group ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
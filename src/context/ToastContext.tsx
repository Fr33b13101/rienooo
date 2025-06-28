import { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, type, message },
    ]);

    // Auto-remove toast after 5 seconds to prevent memory leaks
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, 5000);

    // Store timeout ID for potential cleanup
    return () => clearTimeout(timeoutId);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Cleanup function to remove all toasts (useful for unmounting)
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
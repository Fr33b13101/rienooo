import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

const FullscreenModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}: FullscreenModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden
          transform transition-all duration-300 animate-scale-in
          ${className}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 bg-white sticky top-0 z-10">
            <h2 className="text-2xl font-bold text-secondary-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <X size={24} className="text-secondary-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
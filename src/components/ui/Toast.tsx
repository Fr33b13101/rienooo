import { useToast } from '../../hooks/useToast';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        // Set icon and color based on toast type
        let icon;
        let bgColor;
        let borderColor;

        switch (toast.type) {
          case 'success':
            icon = <CheckCircle className="h-5 w-5 text-success-600" />;
            bgColor = 'bg-success-50';
            borderColor = 'border-success-500';
            break;
          case 'error':
            icon = <AlertCircle className="h-5 w-5 text-error-600" />;
            bgColor = 'bg-error-50';
            borderColor = 'border-error-500';
            break;
          case 'warning':
            icon = <AlertTriangle className="h-5 w-5 text-warning-600" />;
            bgColor = 'bg-warning-50';
            borderColor = 'border-warning-500';
            break;
          case 'info':
          default:
            icon = <Info className="h-5 w-5 text-primary-600" />;
            bgColor = 'bg-primary-50';
            borderColor = 'border-primary-500';
            break;
        }

        return (
          <div
            key={toast.id}
            className={`${bgColor} border-l-4 ${borderColor} p-4 rounded shadow-md animate-fade-in flex items-start`}
          >
            <div className="flex-shrink-0 mr-3">
              {icon}
            </div>
            <div className="flex-1 mr-2">
              <p className="text-sm font-medium text-secondary-800">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
import { Circle as CircleNotch } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

const Loading = ({ 
  size = 40, 
  fullScreen = false, 
  message = 'Loading...', 
  className = '' 
}: LoadingProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        <LoadingSpinner size={size} className="text-primary-800" />
        <p className="mt-4 text-primary-800 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size={size} className="text-primary-800" />
      <p className="mt-2 text-primary-800 font-medium">{message}</p>
    </div>
  );
};

export default Loading;
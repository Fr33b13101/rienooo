import { Circle as CircleNotch } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 20, className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <CircleNotch 
        className="animate-spin text-current" 
        size={size} 
      />
    </div>
  );
};

export default LoadingSpinner;
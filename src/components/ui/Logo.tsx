import { BarChart3 } from 'lucide-react';

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 24 }: LogoProps) => {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg p-1">
        <BarChart3 size={size} className="text-primary-800" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-500 rounded-full" />
    </div>
  );
};
'use client';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'red' | 'white' | 'gray';
}

export default function Loading({ 
  size = 'md', 
  className = '',
  color = 'red'
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    red: 'border-red-700',
    white: 'border-white',
    gray: 'border-gray-700'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          animate-spin 
          rounded-full 
          border-b-2 
          ${colorClasses[color]}
          ${sizeClasses[size]}
        `}
      />
    </div>
  );
} 
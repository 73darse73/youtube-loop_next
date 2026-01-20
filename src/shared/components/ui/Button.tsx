'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  isLoading?: boolean;
}

/**
 * 再利用可能なボタンコンポーネント
 */
export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-red-700 text-white hover:bg-red-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600'
  };

  return (
    <button
      className={`
        ${variantStyles[variant]} 
        px-4 py-2 
        rounded-md 
        transition-colors 
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        </div>
      ) : (
        children
      )}
    </button>
  );
} 
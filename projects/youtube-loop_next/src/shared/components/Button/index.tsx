'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * 再利用可能なボタンコンポーネント
 */
export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-red-700 text-white hover:bg-red-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
  };

  return (
    <button
      className={`${variantStyles[variant]} px-3 py-1 text-sm rounded transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 
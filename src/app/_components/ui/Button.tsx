'use client';

import { ReactNode, useMemo } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * 再利用可能なボタンコンポーネント
 */
export default function Button({
  onClick,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  // バリアントに基づいてスタイルを決定（useMemoで最適化）
  const variantStyles = useMemo(() => ({
    primary: 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-700',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:bg-gray-700',
    success: 'bg-green-500 hover:bg-green-600 focus:bg-green-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-700',
  }), []);

  // 無効状態のスタイル
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // childrenが文字列の場合にaria-labelとして使用
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (children && typeof children === 'string') return children;
    return undefined;
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={getAriaLabel()}
      aria-disabled={disabled}
      className={`${variantStyles[variant]} text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant === 'primary' ? 'blue' : variant === 'secondary' ? 'gray' : variant === 'success' ? 'green' : 'yellow'}-500 ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
} 
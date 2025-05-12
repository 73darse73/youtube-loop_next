'use client';

import { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string | null;
  ariaDescribedby?: string;
}

/**
 * 再利用可能な入力フィールドコンポーネント
 */
export default function Input({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  error = null,
  ariaDescribedby = '',
}: InputProps) {
  // エラー状態に基づいてボーダーの色を決定
  const borderColorClass = error ? 'border-red-500' : 'border-gray-300';
  
  return (
    <div className={`flex flex-col gap-2 mb-4 ${className}`}>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full md:w-4/5 border-2 ${borderColorClass} rounded-md p-2 focus:outline-none focus:border-blue-500`}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedby ? ariaDescribedby : undefined}
        aria-errormessage={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 
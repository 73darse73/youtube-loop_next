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
}: InputProps) {
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
        className={`w-full md:w-4/5 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 
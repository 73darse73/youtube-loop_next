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
  required?: boolean;
}

export default function Input({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  error = null,
  ariaDescribedby,
  required = false,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={ariaDescribedby}
        required={required}
        className={`
          w-full 
          px-4 
          py-2 
          border 
          rounded-md 
          focus:ring-2 
          focus:ring-red-500 
          focus:border-red-500 
          ${error ? 'border-red-500' : 'border-gray-300'} 
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
} 
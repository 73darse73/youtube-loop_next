'use client';

import { ReactNode } from 'react';

interface FormGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  description?: string;
}

/**
 * フォームグループをラップするコンポーネント
 * fieldsetとlegendを使用してセマンティックな構造に
 */
export default function FormGroup({
  title,
  children,
  className = '',
  id,
  description,
}: FormGroupProps) {
  // ユニークなIDの生成
  const groupId = id || (title ? title.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  return (
    <fieldset 
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${className}`}
      aria-describedby={description ? `${groupId}-desc` : undefined}
    >
      {title && <legend className="text-xl font-bold px-2">{title}</legend>}
      {description && (
        <p id={`${groupId}-desc`} className="text-gray-600 text-sm mb-4">
          {description}
        </p>
      )}
      {children}
    </fieldset>
  );
} 
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Loading = ({ size = 'md' }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-red-700 ${sizeClasses[size]}`}
      />
    </div>
  );
}; 
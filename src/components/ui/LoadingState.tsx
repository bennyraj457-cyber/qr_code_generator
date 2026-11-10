import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  className,
  size = 'md',
}) => {
  const spinnerSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 gap-3 text-on-surface-muted',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-primary-600', spinnerSizes[size])} />
      {message && <p className="text-xs sm:text-sm font-medium">{message}</p>}
    </div>
  );
};


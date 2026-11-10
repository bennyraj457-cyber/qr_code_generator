import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-subdued rounded-2xl bg-surface-base/50',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-on-surface-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};


import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40',
    secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950/40 dark:text-secondary-400 border border-secondary-200/50',
    success: 'bg-success-container text-success dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30',
    warning: 'bg-warning-container text-warning dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30',
    error: 'bg-error-container text-error dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30',
    neutral: 'bg-surface-raised text-on-surface-variant border border-subdued',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 leading-none font-semibold rounded-full',
    md: 'text-xs px-2.5 py-1 leading-normal font-semibold rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 uppercase tracking-wide select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};


import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  level?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  action,
  level = 'md',
  className,
}) => {
  const titleStyles = {
    sm: 'text-sm font-semibold tracking-tight',
    md: 'text-base sm:text-lg font-bold tracking-tight',
    lg: 'text-xl sm:text-2xl font-extrabold tracking-tight',
  };

  return (
    <div className={cn('flex items-start justify-between gap-4 pb-2', className)}>
      <div>
        <h2 className={cn('text-on-surface', titleStyles[level])}>{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};


import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2 | 3;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, level = 1, interactive = false, children, ...props }, ref) => {
    const elevationClasses = {
      0: 'bg-canvas border-transparent',
      1: 'bg-surface-base border border-subdued shadow-level-1',
      2: 'bg-surface-base border border-subdued shadow-level-2',
      3: 'bg-surface-base border border-subdued shadow-level-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl sm:rounded-2xl transition-all duration-200 overflow-hidden',
          elevationClasses[level],
          interactive && 'hover:border-strong hover:shadow-level-2 cursor-pointer active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';


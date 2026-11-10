import React from 'react';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      'aria-label': ariaLabel,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
      secondary: 'bg-surface-base text-on-surface border border-subdued hover:bg-surface-raised',
      outline: 'bg-transparent border border-subdued text-on-surface hover:bg-surface-raised',
      ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-raised',
      danger: 'bg-error/10 text-error hover:bg-error/20 active:bg-error/30',
    };

    const sizes = {
      sm: 'w-8 h-8 p-1 min-h-[32px] min-w-[32px]',
      md: 'w-11 h-11 p-2 min-h-[44px] min-w-[44px]', // enforces min 44px touch target on mobile
      lg: 'w-12 h-12 p-2.5 min-h-[48px] min-w-[48px]',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';


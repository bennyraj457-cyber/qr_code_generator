import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium select-none transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 min-h-[44px] cursor-pointer';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] shadow-sm',
      secondary:
        'bg-surface-base text-on-surface border border-subdued hover:bg-surface-raised active:bg-surface-raised/80',
      outline:
        'bg-transparent border border-subdued text-on-surface hover:bg-surface-raised hover:border-strong',
      ghost:
        'bg-transparent text-on-surface hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600',
      danger:
        'bg-error text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[38px] sm:min-h-[36px]',
      md: 'text-sm px-4 py-2 rounded-xl gap-2 min-h-[44px]',
      lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';


import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-on-surface select-none tracking-tight flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-on-surface-muted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full min-h-[44px] h-10 px-3 py-2 text-sm bg-surface-base border rounded-lg text-on-surface placeholder:text-on-surface-muted/60 transition-all duration-150',
              'focus:outline-none focus:border-primary-600 focus:ring-3 focus:ring-primary-600/15',
              'disabled:bg-surface-raised disabled:text-on-surface-muted disabled:cursor-not-allowed',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-subdued hover:border-strong',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-on-surface-muted">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-error flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-on-surface-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';


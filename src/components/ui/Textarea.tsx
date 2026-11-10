import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs sm:text-sm font-semibold text-on-surface select-none tracking-tight"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 text-sm bg-surface-base border rounded-lg text-on-surface placeholder:text-on-surface-muted/60 transition-all duration-150 resize-y',
            'focus:outline-none focus:border-primary-600 focus:ring-3 focus:ring-primary-600/15',
            'disabled:bg-surface-raised disabled:text-on-surface-muted disabled:cursor-not-allowed',
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-subdued hover:border-strong',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs font-medium text-error flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-on-surface-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';


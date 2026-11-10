import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs sm:text-sm font-semibold text-on-surface select-none tracking-tight"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full min-h-[44px] h-10 pl-3 pr-10 py-2 text-sm bg-surface-base border rounded-lg text-on-surface appearance-none transition-all duration-150 cursor-pointer',
              'focus:outline-none focus:border-primary-600 focus:ring-3 focus:ring-primary-600/15',
              'disabled:bg-surface-raised disabled:text-on-surface-muted disabled:cursor-not-allowed',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-subdued hover:border-strong',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 flex items-center pointer-events-none text-on-surface-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';


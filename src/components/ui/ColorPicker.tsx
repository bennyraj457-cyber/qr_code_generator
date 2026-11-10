import React from 'react';
import { cn } from '../../utils/cn';

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  presetColors?: string[];
  helperText?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = [
    '#4F46E5', // Electric Indigo
    '#000000', // Pitch Black
    '#0EA5E9', // Slate Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#F43F5E', // Rose
    '#8B5CF6', // Purple
    '#FFFFFF', // White
  ],
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs sm:text-sm font-semibold text-on-surface tracking-tight">
          {label}
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Color preview circle that acts as native picker trigger */}
        <div className="relative w-10 h-10 rounded-full border-2 border-subdued overflow-hidden shrink-0 shadow-xs cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-16 h-16 opacity-0 cursor-pointer"
            aria-label={label || 'Pick a color'}
          />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>

        {/* Hex input field */}
        <div className="flex-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            maxLength={7}
            placeholder="#000000"
            className="w-full min-h-[40px] px-3 py-1.5 font-mono text-xs sm:text-sm uppercase bg-surface-base border border-subdued rounded-lg text-on-surface focus:outline-none focus:border-primary-600 focus:ring-3 focus:ring-primary-600/15"
          />
        </div>
      </div>

      {/* Preset Swatches */}
      {presetColors.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {presetColors.map((color) => {
            const isSelected = value.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                onClick={() => onChange(color)}
                className={cn(
                  'w-7 h-7 rounded-full border transition-transform hover:scale-110 active:scale-95 cursor-pointer',
                  isSelected
                    ? 'ring-2 ring-primary-600 ring-offset-2 ring-offset-surface-base border-transparent'
                    : 'border-black/10 dark:border-white/20'
                )}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Select color ${color}`}
              />
            );
          })}
        </div>
      )}

      {helperText && <p className="text-xs text-on-surface-muted">{helperText}</p>}
    </div>
  );
};


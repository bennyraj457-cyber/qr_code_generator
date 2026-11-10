import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
      />

      {/* Sheet on mobile, centered modal on tablet/desktop */}
      <div
        className={cn(
          'relative w-full bg-surface-base border border-subdued shadow-level-3 rounded-t-2xl sm:rounded-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden',
          maxWidths[maxWidth]
        )}
      >
        {(Boolean(title) || Boolean(onClose)) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-subdued shrink-0">
            <div>
              {title && <h3 className="text-base sm:text-lg font-bold text-on-surface">{title}</h3>}
              {description && (
                <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">{description}</p>
              )}
            </div>
            {onClose && (
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Close modal"
                onClick={onClose}
                className="ml-auto"
              >
                <X className="w-5 h-5" />
              </IconButton>
            )}
          </div>
        )}

        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

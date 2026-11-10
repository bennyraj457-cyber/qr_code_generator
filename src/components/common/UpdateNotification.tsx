import React from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface UpdateNotificationProps {
  isOpen: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  isOpen,
  onUpdate,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-[calc(100%-2rem)] p-4 rounded-2xl bg-surface-base border border-primary-500 shadow-level-3 animate-in slide-in-from-bottom duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-on-surface">Update Available</h4>
          <p className="text-xs text-on-surface-muted mt-0.5">
            A new version of QR Studio is ready. Update now to activate the latest features.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onUpdate}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Update Now
            </Button>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Later
            </Button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-on-surface-muted hover:text-on-surface p-1 rounded-lg cursor-pointer"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


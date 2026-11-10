import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200 z-50 sticky top-0"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        You are currently offline. QR Studio continues to generate, customize and save codes locally!
      </span>
    </div>
  );
};

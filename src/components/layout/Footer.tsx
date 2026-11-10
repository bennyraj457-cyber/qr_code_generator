import React from 'react';
import { QrCode, Heart, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-subdued bg-surface-base py-8 sm:py-12 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-on-surface">QR Studio</span>
            </div>
            <p className="text-xs text-on-surface-muted max-w-sm">
              Modern, privacy-first QR Code Generator Progressive Web App engineered for precision generative design.
            </p>
          </div>

          {/* Value props badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-on-surface-variant font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              PWA Offline Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Free & Open Standard
            </span>
          </div>

          {/* Copyright notice */}
          <div className="text-xs text-on-surface-muted text-center md:text-right">
            <p>© 2026 QR Studio. All rights reserved.</p>
            <p className="mt-0.5 text-[11px]">Engineered to design.md specification.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

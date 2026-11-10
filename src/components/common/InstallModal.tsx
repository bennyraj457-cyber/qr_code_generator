import React from 'react';
import {
  DownloadCloud,
  Share,
  PlusSquare,
  Monitor,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  isInstallable: boolean;
  onPromptInstall: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  isInstallable,
  onPromptInstall,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Install QR Studio App"
      description="Enjoy full-screen standalone usage, faster startup, and complete offline capability."
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 text-sm text-on-surface">
        {/* If native install prompt is available (Chrome / Edge / Android) */}
        {isInstallable && (
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-primary-700 dark:text-primary-300">
              <DownloadCloud className="w-5 h-5" />
              <span>One-Click Fast Install</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your browser supports direct installation. Click below to add QR Studio to your device home screen or desktop.
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                onPromptInstall();
                onClose();
              }}
              leftIcon={<DownloadCloud className="w-4 h-4" />}
            >
              Install QR Studio Now
            </Button>
          </div>
        )}

        {/* iOS Specific Instructions */}
        {isIOS && (
          <div className="p-4 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <Smartphone className="w-5 h-5 text-primary-600" />
              <span>Apple iOS (Safari) Installation</span>
            </div>
            <ol className="text-xs text-on-surface-muted space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Tap the <span className="font-semibold text-on-surface inline-flex items-center gap-1 mx-1"><Share className="w-3.5 h-3.5" /> Share</span> icon in Safari's bottom toolbar.
              </li>
              <li>
                Scroll down and tap <span className="font-semibold text-on-surface inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
              </li>
              <li>
                Tap <span className="font-semibold text-on-surface">Add</span> in the top-right corner to finish.
              </li>
            </ol>
          </div>
        )}

        {/* Android / Desktop Manual Instructions if prompt dismissed or non-supported */}
        {!isIOS && !isInstallable && (
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <Monitor className="w-4 h-4 text-primary-600" />
                <span>Desktop (Chrome, Edge, Brave)</span>
              </div>
              <p className="text-xs text-on-surface-muted leading-relaxed">
                Click the <span className="font-semibold text-on-surface">Install icon</span> on the right side of the address bar, or open the browser menu (⋮) and select <strong>Install QR Studio</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <Smartphone className="w-4 h-4 text-secondary-600" />
                <span>Android (Chrome, Firefox, Samsung Internet)</span>
              </div>
              <p className="text-xs text-on-surface-muted leading-relaxed">
                Tap the browser menu (⋮) and choose <strong>Add to Home screen</strong> or <strong>Install app</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Value features */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-muted pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Works 100% Offline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Server Tracking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fast Instant Launch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Storage Saved</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

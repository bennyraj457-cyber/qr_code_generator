import React, { useState, useRef } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Palette,
  Sliders,
  Shield,
  DownloadCloud,
  UploadCloud,
  Trash2,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card, Button, Select, ColorPicker, Badge, Modal } from '../components/ui';
import { useAppSettings } from '../features/settings';
import { useQRHistory } from '../features/qr-history';
import type { ThemeMode } from '../types';
import type { ErrorCorrectionLevel } from '../features/qr-customization/types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useAppSettings();
  const { items, clearAll, exportJSON, importJSON } = useQRHistory();

  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [importNotice, setImportNotice] = useState<{ success: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { mode: 'system', label: 'System Default', icon: <Monitor className="w-4 h-4" /> },
  ];

  const sizeOptions = [
    { value: '256', label: 'Small (256px)' },
    { value: '512', label: 'Medium (512px) - Recommended' },
    { value: '1024', label: 'Large (1024px)' },
    { value: '2048', label: 'Ultra (2048px)' },
  ];

  const errorCorrectionOptions = [
    { value: 'L', label: 'Level L (7% recovery)' },
    { value: 'M', label: 'Level M (15% recovery)' },
    { value: 'Q', label: 'Level Q (25% recovery)' },
    { value: 'H', label: 'Level H (30% recovery) - Recommended' },
  ];

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importJSON(content);
      if (res.success) {
        setImportNotice({
          success: true,
          msg: `Successfully imported ${res.importedCount} QR code(s).`,
        });
      } else {
        setImportNotice({
          success: false,
          msg: res.error || 'Failed to import backup.',
        });
      }
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              App Settings
            </h1>
            <Badge variant="primary" size="sm">
              Preferences
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-on-surface-muted mt-1">
            Customize visual theme, default QR specifications, and local data backups.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetSettings}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="text-xs"
        >
          Reset Defaults
        </Button>
      </div>

      {/* Import status notification */}
      {importNotice && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200 ${
            importNotice.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-error/10 border-error/30 text-error'
          }`}
        >
          {importNotice.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{importNotice.msg}</span>
        </div>
      )}

      {/* 2. Appearance Section */}
      <Card level={1} className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-subdued pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary-600" />
            <h3 className="text-base font-bold text-on-surface">Appearance & Theme</h3>
          </div>
          <Badge variant="neutral" size="sm">
            Interface
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map((opt) => {
            const isSelected = settings.theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => updateSetting('theme', opt.mode)}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer min-h-[48px] ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-xs'
                    : 'border-subdued bg-surface-base text-on-surface hover:bg-surface-raised'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. QR Default Preferences */}
      <Card level={1} className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-subdued pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary-600" />
            <h3 className="text-base font-bold text-on-surface">Default QR Preferences</h3>
          </div>
          <Badge variant="neutral" size="sm">
            Presets
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Default Export Size"
            options={sizeOptions}
            value={settings.defaultSize.toString()}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateSetting('defaultSize', parseInt(e.target.value, 10))
            }
          />

          <Select
            label="Default Error Correction Level"
            options={errorCorrectionOptions}
            value={settings.defaultErrorCorrection}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateSetting('defaultErrorCorrection', e.target.value as ErrorCorrectionLevel)
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <ColorPicker
            label="Default Foreground Color"
            value={settings.defaultFgColor}
            onChange={(c: string) => updateSetting('defaultFgColor', c)}
          />

          <ColorPicker
            label="Default Background Color"
            value={settings.defaultBgColor}
            onChange={(c: string) => updateSetting('defaultBgColor', c)}
          />
        </div>
      </Card>

      {/* 4. App Preferences */}
      <Card level={1} className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-subdued pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            <h3 className="text-base font-bold text-on-surface">App Behavior</h3>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-subdued cursor-pointer">
            <div>
              <span className="text-xs sm:text-sm font-bold text-on-surface block">
                Remember Last Selected QR Type
              </span>
              <span className="text-[11px] text-on-surface-muted">
                Automatically opens the QR Generator to your most recently used format.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.rememberLastType}
              onChange={(e) => updateSetting('rememberLastType', e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-subdued cursor-pointer">
            <div>
              <span className="text-xs sm:text-sm font-bold text-on-surface block">
                Show PWA Installation Help
              </span>
              <span className="text-[11px] text-on-surface-muted">
                Displays installation prompts and home screen guides.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.showInstallInstructions}
              onChange={(e) => updateSetting('showInstallInstructions', e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer ml-3"
            />
          </label>
        </div>
      </Card>

      {/* 5. Data Management */}
      <Card level={1} className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-subdued pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-on-surface">Data Management & Privacy</h3>
          </div>
          <Badge variant="primary" size="sm">
            Local Only
          </Badge>
        </div>

        <p className="text-xs text-on-surface-muted leading-relaxed">
          Your saved QR codes, custom preferences, and settings are stored 100% locally on this device using browser LocalStorage. QR Studio does not upload or synchronize your information to any remote server.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json,application/json"
            className="hidden"
          />

          <Button
            variant="outline"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<UploadCloud className="w-4 h-4 text-primary-600" />}
          >
            Import JSON Backup
          </Button>

          <Button
            variant="outline"
            size="md"
            disabled={items.length === 0}
            onClick={exportJSON}
            leftIcon={<DownloadCloud className="w-4 h-4 text-secondary-600" />}
          >
            Export All History ({items.length})
          </Button>

          <Button
            variant="danger"
            size="md"
            disabled={items.length === 0}
            onClick={() => setIsConfirmClearOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="ml-auto"
          >
            Clear All Saved Codes
          </Button>
        </div>
      </Card>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Confirm Clear All History"
        description="Are you sure you want to permanently delete all saved QR codes from this device? This action cannot be reversed."
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => setIsConfirmClearOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              clearAll();
              setIsConfirmClearOpen(false);
            }}
          >
            Permanently Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

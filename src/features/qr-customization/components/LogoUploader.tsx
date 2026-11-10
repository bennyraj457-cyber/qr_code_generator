import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface LogoUploaderProps {
  logoDataUrl: string | null;
  logoFileName: string | null;
  onLogoChange: (dataUrl: string | null, fileName: string | null) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoDataUrl,
  logoFileName,
  onLogoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadError(null);

    // Validate type: PNG, JPG, WebP
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only PNG, JPG, and WebP images are supported.');
      return;
    }

    // Validate size: 2MB max
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File exceeds 2MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result, file.name);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeLogo = () => {
    onLogoChange(null, null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-primary-600" />
          <span>Center Logo / Badge</span>
        </label>
        <span className="text-[11px] text-on-surface-muted">PNG, JPG, WebP (max 2MB)</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {logoDataUrl ? (
        <div className="p-3 rounded-xl bg-surface-raised border border-subdued flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-surface-base border border-subdued p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src={logoDataUrl}
                alt="Logo thumbnail"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">
                {logoFileName || 'logo-image.png'}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Error Correction H (30%) enforced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeLogo}
              className="text-error hover:text-error"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-subdued hover:border-primary-500 rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-surface-raised/40 hover:bg-surface-raised"
        >
          <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface">
              Click or drag image to upload center logo
            </p>
            <p className="text-[11px] text-on-surface-muted mt-0.5">
              Processed 100% locally in browser memory. Kept within scannable bounds.
            </p>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {uploadError}
        </p>
      )}
    </div>
  );
};


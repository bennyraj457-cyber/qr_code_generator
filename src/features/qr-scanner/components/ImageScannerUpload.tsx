import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { decodeQRFromImageFile } from '../utils/scannerService';
import type { ScanResult } from '../types';

interface ImageScannerUploadProps {
  onScanComplete: (result: ScanResult) => void;
}

export const ImageScannerUpload: React.FC<ImageScannerUploadProps> = ({
  onScanComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate type: PNG, JPG, JPEG, WebP
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please choose a valid PNG, JPG, JPEG, or WebP image.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await decodeQRFromImageFile(file);
      setIsProcessing(false);
      onScanComplete(result);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Failed to decode QR from image.';
      setErrorMessage(msg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-subdued hover:border-primary-500 rounded-2xl p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors bg-surface-base/80 hover:bg-surface-raised"
      >
        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center">
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-on-surface">
            {isProcessing ? 'Analyzing QR matrix locally...' : 'Upload or Drag & Drop QR Image'}
          </p>
          <p className="text-[11px] text-on-surface-muted mt-0.5">
            Supports PNG, JPG, JPEG, and WebP (Zero uploads • Processed on-device)
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isProcessing}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          leftIcon={<ImageIcon className="w-4 h-4" />}
        >
          Select Image from Device
        </Button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error flex items-start gap-2 text-xs font-semibold animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};


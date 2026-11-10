import { useState, useCallback } from 'react';
import type {
  QRGenerationOptions,
  QRGenerationResult,
  QRPayloadUnion,
} from '../types';
import {
  buildQRContent,
  validatePayload,
  generateQRCode,
  downloadFile,
} from '../utils/qrGenerator';

export interface UseQRGeneratorReturn {
  rawPayload: string;
  qrResult: QRGenerationResult | null;
  isLoading: boolean;
  error: string | null;
  validationError: string | null;
  hasGenerated: boolean;
  generate: (payload: QRPayloadUnion, options?: QRGenerationOptions) => Promise<boolean>;
  downloadPNG: (filename?: string) => boolean;
  downloadSVG: (filename?: string) => boolean;
  copyPayload: () => Promise<boolean>;
  shareQR: (title?: string) => Promise<boolean>;
}

export function useQRGenerator(): UseQRGeneratorReturn {
  const [rawPayload, setRawPayload] = useState<string>('');
  const [qrResult, setQrResult] = useState<QRGenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const generate = useCallback(
    async (payload: QRPayloadUnion, options?: QRGenerationOptions): Promise<boolean> => {
      // 1. Reset error states
      setError(null);
      setValidationError(null);

      // 2. Validate payload input
      const validation = validatePayload(payload);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid input.');
        return false;
      }

      // 3. Construct standard format payload
      const content = buildQRContent(payload);
      setRawPayload(content);

      // 4. Generate QR Code
      setIsLoading(true);
      try {
        const result = await generateQRCode(content, options);
        setQrResult(result);
        setHasGenerated(true);
        setIsLoading(false);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'QR generation failed.';
        setError(message);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  const downloadPNG = useCallback(
    (filename: string = 'qr-studio-code.png'): boolean => {
      if (!qrResult?.pngDataUrl) return false;
      downloadFile(qrResult.pngDataUrl, filename, true);
      return true;
    },
    [qrResult]
  );

  const downloadSVG = useCallback(
    (filename: string = 'qr-studio-code.svg'): boolean => {
      if (!qrResult?.svgString) return false;
      downloadFile(qrResult.svgString, filename, false);
      return true;
    },
    [qrResult]
  );

  const copyPayload = useCallback(async (): Promise<boolean> => {
    if (!rawPayload) return false;
    try {
      await navigator.clipboard.writeText(rawPayload);
      return true;
    } catch {
      return false;
    }
  }, [rawPayload]);

  const shareQR = useCallback(
    async (title: string = 'QR Studio Barcode'): Promise<boolean> => {
      if (!qrResult) return false;

      // Check if Web Share API with files is supported
      if (navigator.share) {
        try {
          // Convert data URL to Blob
          const res = await fetch(qrResult.pngDataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'qr-code.png', { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text: `Scannable QR code generated with QR Studio`,
              files: [file],
            });
            return true;
          } else {
            // Fallback to URL/text share
            await navigator.share({
              title,
              text: rawPayload,
              url: rawPayload.startsWith('http') ? rawPayload : undefined,
            });
            return true;
          }
        } catch (err) {
          // Ignore user abort or share cancel
          if ((err as Error).name === 'AbortError') return true;
        }
      }

      // Graceful fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(rawPayload);
        return true;
      } catch {
        return false;
      }
    },
    [qrResult, rawPayload]
  );

  return {
    rawPayload,
    qrResult,
    isLoading,
    error,
    validationError,
    hasGenerated,
    generate,
    downloadPNG,
    downloadSVG,
    copyPayload,
    shareQR,
  };
}


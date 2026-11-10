import { BrowserQRCodeReader } from '@zxing/browser';
import { parseScanResult } from './resultParser';
import type { ScanResult } from '../types';

let codeReader: BrowserQRCodeReader | null = null;

export function getCodeReader(): BrowserQRCodeReader {
  if (!codeReader) {
    codeReader = new BrowserQRCodeReader();
  }
  return codeReader;
}

/**
 * Decodes a QR code from an image File or Blob completely locally in browser memory.
 */
export async function decodeQRFromImageFile(file: File): Promise<ScanResult> {
  const reader = getCodeReader();
  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await reader.decodeFromImageUrl(imageUrl);
    URL.revokeObjectURL(imageUrl);
    if (!result || !result.getText()) {
      throw new Error('No QR code detected in this image.');
    }
    return parseScanResult(result.getText());
  } catch {
    URL.revokeObjectURL(imageUrl);
    throw new Error('Could not find or read any valid QR code in the selected image. Please try an image with better lighting and higher resolution.');
  }
}


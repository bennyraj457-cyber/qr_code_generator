import type { QRContentType, QRPayloadUnion } from '../../qr-generator/types';
import type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from '../../qr-customization/types';

export interface SavedQRCode {
  id: string;
  name: string;
  type: QRContentType;
  content: string; // generated standard QR payload string
  payloadData: QRPayloadUnion['data']; // raw input form data
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  logoDataUrl?: string | null;
  logoFileName?: string | null;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  thumbnailUrl?: string; // compressed PNG thumbnail for instant rendering in history cards
}

export type QRHistorySortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc';


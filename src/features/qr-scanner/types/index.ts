export type DetectedContentType =
  | 'url'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'vcard'
  | 'text';

export interface ScanResult {
  rawText: string;
  type: DetectedContentType;
  timestamp: number;
  metadata?: {
    title?: string;
    actionUrl?: string;
    details?: Record<string, string>;
  };
}

export type CameraErrorType =
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'IN_USE'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface CameraDevice {
  deviceId: string;
  label: string;
}


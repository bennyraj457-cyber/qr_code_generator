import type { QRCodeErrorCorrectionLevel } from 'qrcode';

export type ErrorCorrectionLevel = QRCodeErrorCorrectionLevel;

export type QRContentType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'vcard'
  | 'location';

export interface QRGenerationOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: ErrorCorrectionLevel;
}

export interface QRGenerationResult {
  pngDataUrl: string;
  svgString: string;
  rawPayload: string;
}

export interface WebsitePayload {
  url: string;
}

export interface TextPayload {
  text: string;
}

export interface WifiPayload {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface EmailPayload {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhonePayload {
  phone: string;
}

export interface SmsPayload {
  phone: string;
  message?: string;
}

export interface WhatsAppPayload {
  countryCode: string;
  phone: string;
  message?: string;
}

export interface VCardPayload {
  name: string;
  phone?: string;
  email?: string;
  organization?: string;
  website?: string;
}

export interface LocationPayload {
  latitude: string;
  longitude: string;
  query?: string;
}

export type QRPayloadUnion =
  | { type: 'url'; data: WebsitePayload }
  | { type: 'text'; data: TextPayload }
  | { type: 'wifi'; data: WifiPayload }
  | { type: 'email'; data: EmailPayload }
  | { type: 'phone'; data: PhonePayload }
  | { type: 'sms'; data: SmsPayload }
  | { type: 'whatsapp'; data: WhatsAppPayload }
  | { type: 'vcard'; data: VCardPayload }
  | { type: 'location'; data: LocationPayload };

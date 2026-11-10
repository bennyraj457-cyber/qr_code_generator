import QRCode from 'qrcode';
import type {
  QRGenerationOptions,
  QRGenerationResult,
  QRPayloadUnion,
  WifiPayload,
  EmailPayload,
  PhonePayload,
  SmsPayload,
  WhatsAppPayload,
  VCardPayload,
} from '../types';

/**
 * Escapes special characters for Wi-Fi QR format (WIFI:T:...;S:...;P:...;;)
 * Backslash, semicolon, comma, and colon must be escaped with a backslash.
 */
export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

/**
 * Escapes values for vCard 3.0 according to RFC 2426.
 * Semicolons, colons, commas and newlines must be properly escaped.
 */
export function escapeVCardString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Cleans phone number to international E.164-like format (digits and optional leading +)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Formats structured data into the official QR Code string standard.
 */
export function buildQRContent(payload: QRPayloadUnion): string {
  switch (payload.type) {
    case 'url': {
      let raw = payload.data.url.trim();
      if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        raw = 'https://' + raw;
      }
      return raw;
    }

    case 'text': {
      return payload.data.text;
    }

    case 'wifi': {
      const { ssid, password, security, hidden } = payload.data as WifiPayload;
      const escapedSsid = escapeWifiString(ssid.trim());
      const escapedPass = password ? escapeWifiString(password) : '';
      const secType = security || 'WPA';
      const isHidden = hidden ? 'H:true;' : '';

      if (secType === 'nopass' || !password) {
        return `WIFI:T:nopass;S:${escapedSsid};;${isHidden};`;
      }
      return `WIFI:T:${secType};S:${escapedSsid};P:${escapedPass};${isHidden};`;
    }

    case 'email': {
      const { email, subject, body } = payload.data as EmailPayload;
      const params = new URLSearchParams();
      if (subject?.trim()) params.append('subject', subject.trim());
      if (body?.trim()) params.append('body', body.trim());
      const query = params.toString();
      return `mailto:${email.trim()}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const { phone } = payload.data as PhonePayload;
      const cleanPhone = formatPhoneNumber(phone);
      return `tel:${cleanPhone}`;
    }

    case 'sms': {
      const { phone, message } = payload.data as SmsPayload;
      const cleanPhone = formatPhoneNumber(phone);
      const encodedMsg = message?.trim() ? `?body=${encodeURIComponent(message.trim())}` : '';
      return `sms:${cleanPhone}${encodedMsg}`;
    }

    case 'whatsapp': {
      const { countryCode, phone, message } = payload.data as WhatsAppPayload;
      const fullDigits = formatPhoneNumber(`${countryCode}${phone}`).replace(/^\+/, '');
      const encodedText = message?.trim() ? `?text=${encodeURIComponent(message.trim())}` : '';
      return `https://wa.me/${fullDigits}${encodedText}`;
    }

    case 'vcard': {
      const { name, phone, email, organization, website } = payload.data as VCardPayload;
      const lines: string[] = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${escapeVCardString(name.trim())}`,
        `N:${escapeVCardString(name.trim())};;;;`,
      ];
      if (organization?.trim()) {
        lines.push(`ORG:${escapeVCardString(organization.trim())}`);
      }
      if (phone?.trim()) {
        lines.push(`TEL;TYPE=CELL,VOICE:${formatPhoneNumber(phone)}`);
      }
      if (email?.trim()) {
        lines.push(`EMAIL;TYPE=INTERNET,PREF:${email.trim()}`);
      }
      if (website?.trim()) {
        let web = website.trim();
        if (!web.startsWith('http://') && !web.startsWith('https://')) {
          web = 'https://' + web;
        }
        lines.push(`URL:${web}`);
      }
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'location': {
      const { latitude, longitude, query } = payload.data as { latitude: string; longitude: string; query?: string };
      const lat = latitude.trim();
      const lng = longitude.trim();
      if (lat && lng) {
        const qParam = query?.trim() ? `?q=${encodeURIComponent(query.trim())}` : `?q=${lat},${lng}`;
        return `https://maps.google.com/${qParam}`;
      }
      return query?.trim() ? `https://maps.google.com/?q=${encodeURIComponent(query.trim())}` : 'https://maps.google.com/';
    }

    default:
      return '';
  }
}

/**
 * Validates payload inputs for each QR type before generation.
 */
export function validatePayload(payload: QRPayloadUnion): { valid: boolean; error?: string } {
  switch (payload.type) {
    case 'url': {
      const val = payload.data.url.trim();
      if (!val) return { valid: false, error: 'Please enter a website URL.' };
      try {
        const fullUrl = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
        new URL(fullUrl);
        return { valid: true };
      } catch {
        return { valid: false, error: 'Please enter a valid website address.' };
      }
    }

    case 'text': {
      if (!payload.data.text.trim()) {
        return { valid: false, error: 'Please enter some text.' };
      }
      return { valid: true };
    }

    case 'wifi': {
      if (!payload.data.ssid.trim()) {
        return { valid: false, error: 'Wi-Fi network name (SSID) is required.' };
      }
      if (payload.data.security !== 'nopass' && !payload.data.password) {
        return { valid: false, error: 'Password is required for encrypted Wi-Fi networks.' };
      }
      return { valid: true };
    }

    case 'email': {
      const email = payload.data.email.trim();
      if (!email) return { valid: false, error: 'Email address is required.' };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { valid: false, error: 'Please enter a valid email address.' };
      }
      return { valid: true };
    }

    case 'phone': {
      const clean = formatPhoneNumber(payload.data.phone);
      if (!clean || clean.length < 3) {
        return { valid: false, error: 'Please enter a valid phone number.' };
      }
      return { valid: true };
    }

    case 'sms': {
      const clean = formatPhoneNumber(payload.data.phone);
      if (!clean || clean.length < 3) {
        return { valid: false, error: 'Please enter a valid recipient phone number.' };
      }
      return { valid: true };
    }

    case 'whatsapp': {
      const fullDigits = formatPhoneNumber(`${payload.data.countryCode}${payload.data.phone}`).replace(/^\+/, '');
      if (!fullDigits || fullDigits.length < 6) {
        return { valid: false, error: 'Please enter a valid WhatsApp phone number with country code.' };
      }
      return { valid: true };
    }

    case 'vcard': {
      if (!payload.data.name.trim()) {
        return { valid: false, error: 'Full name is required for vCard contact.' };
      }
      return { valid: true };
    }

    case 'location': {
      const lat = payload.data.latitude.trim();
      const lng = payload.data.longitude.trim();
      const q = payload.data.query?.trim();
      if (!lat && !lng && !q) {
        return { valid: false, error: 'Please enter location coordinates or a place name.' };
      }
      return { valid: true };
    }

    default:
      return { valid: false, error: 'Unknown QR payload type.' };
  }
}

/**
 * Core generation utility using browser-compatible qrcode package APIs.
 * Generates PNG data URL and SVG markup with 4-module quiet zone enforcement.
 */
export async function generateQRCode(
  content: string,
  options?: QRGenerationOptions
): Promise<QRGenerationResult> {
  if (!content || !content.trim()) {
    throw new Error('Cannot generate QR code from empty content.');
  }

  const qrOptions = {
    errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
    margin: options?.margin !== undefined ? options?.margin : 4, // 4-module quiet zone rule
    width: options?.width || 512,
    color: {
      dark: options?.color?.dark || '#4F46E5',
      light: options?.color?.light || '#FFFFFF',
    },
  };

  try {
    // Generate raster PNG Data URL
    const pngDataUrl = await QRCode.toDataURL(content, qrOptions);

    // Generate crisp vector SVG markup
    const svgString = await QRCode.toString(content, {
      ...qrOptions,
      type: 'svg',
    });

    return {
      pngDataUrl,
      svgString,
      rawPayload: content,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate QR Code.';
    throw new Error(message);
  }
}

/**
 * Helper to trigger browser file download.
 */
export function downloadFile(content: string, filename: string, isDataUrl: boolean = false): void {
  const link = document.createElement('a');
  if (isDataUrl) {
    link.href = content;
  } else {
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (!isDataUrl) {
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}


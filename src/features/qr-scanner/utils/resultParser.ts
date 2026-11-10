import type { ScanResult } from '../types';

/**
 * Detects payload type and extracts structured metadata.
 */
export function parseScanResult(raw: string): ScanResult {
  const trimmed = raw.trim();

  // 1. URL Detection
  if (/^https?:\/\//i.test(trimmed)) {
    // WhatsApp detection
    if (/https?:\/\/(wa\.me|api\.whatsapp\.com)/i.test(trimmed)) {
      return {
        rawText: trimmed,
        type: 'whatsapp',
        timestamp: Date.now(),
        metadata: {
          title: 'WhatsApp Contact Link',
          actionUrl: trimmed,
        },
      };
    }

    return {
      rawText: trimmed,
      type: 'url',
      timestamp: Date.now(),
      metadata: {
        title: 'Website Link',
        actionUrl: trimmed,
      },
    };
  }

  // 2. Wi-Fi (WIFI:S:...;T:...;P:...;;)
  if (/^WIFI:/i.test(trimmed)) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);

    return {
      rawText: trimmed,
      type: 'wifi',
      timestamp: Date.now(),
      metadata: {
        title: 'Wi-Fi Network Credentials',
        details: {
          SSID: ssidMatch ? ssidMatch[1] : 'Unknown',
          Security: typeMatch ? typeMatch[1] : 'WPA',
          Password: passMatch ? passMatch[1] : '(None)',
        },
      },
    };
  }

  // 3. Email (mailto: or email address)
  if (/^mailto:/i.test(trimmed)) {
    return {
      rawText: trimmed,
      type: 'email',
      timestamp: Date.now(),
      metadata: {
        title: 'Email Link',
        actionUrl: trimmed,
      },
    };
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return {
      rawText: trimmed,
      type: 'email',
      timestamp: Date.now(),
      metadata: {
        title: 'Email Address',
        actionUrl: `mailto:${trimmed}`,
      },
    };
  }

  // 4. Phone (tel:)
  if (/^tel:/i.test(trimmed)) {
    return {
      rawText: trimmed,
      type: 'phone',
      timestamp: Date.now(),
      metadata: {
        title: 'Phone Dial Link',
        actionUrl: trimmed,
      },
    };
  }

  // 5. SMS (sms:)
  if (/^sms:/i.test(trimmed)) {
    return {
      rawText: trimmed,
      type: 'sms',
      timestamp: Date.now(),
      metadata: {
        title: 'SMS Message',
        actionUrl: trimmed,
      },
    };
  }

  // 6. vCard Contact
  if (/BEGIN:VCARD/i.test(trimmed)) {
    const fnMatch = trimmed.match(/FN:(.+)/i);
    const telMatch = trimmed.match(/TEL.*:(.+)/i);
    const emailMatch = trimmed.match(/EMAIL.*:(.+)/i);
    const orgMatch = trimmed.match(/ORG:(.+)/i);

    return {
      rawText: trimmed,
      type: 'vcard',
      timestamp: Date.now(),
      metadata: {
        title: 'vCard Contact Card',
        details: {
          Name: fnMatch ? fnMatch[1].trim() : 'Contact',
          Phone: telMatch ? telMatch[1].trim() : '',
          Email: emailMatch ? emailMatch[1].trim() : '',
          Organization: orgMatch ? orgMatch[1].trim() : '',
        },
      },
    };
  }

  // 7. Plain Text (fallback)
  return {
    rawText: trimmed,
    type: 'text',
    timestamp: Date.now(),
    metadata: {
      title: 'Plain Text Note',
    },
  };
}

/**
 * Validates whether a URL is secure and safe to open.
 */
export function isSafeUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

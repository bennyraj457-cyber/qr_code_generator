import type { ColorPreset, ContrastCheckResult } from '../types';

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    fgColor: '#4F46E5',
    bgColor: '#FFFFFF',
    description: 'Signature QR Studio brand styling with vivid contrast',
  },
  {
    id: 'classic-black',
    name: 'Classic Black',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    description: 'Maximum contrast, 100% universal scanner reliability',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    fgColor: '#0B1C30',
    bgColor: '#F0F9FF',
    description: 'Deep navy tone on cool ice cyan background',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    fgColor: '#005338',
    bgColor: '#F2FDF7',
    description: 'Rich organic emerald tone with subtle mint backing',
  },
  {
    id: 'purple-royal',
    name: 'Royal Purple',
    fgColor: '#581C87',
    bgColor: '#FAF5FF',
    description: 'Vibrant regal violet on soft lavender surface',
  },
  {
    id: 'burgundy',
    name: 'Burgundy Velvet',
    fgColor: '#881337',
    bgColor: '#FFF1F2',
    description: 'Deep crimson wine tone on gentle rose canvas',
  },
];

/**
 * Calculates relative luminance according to WCAG 2.1 specifications.
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  }

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Checks contrast ratio between foreground and background colors.
 * Standard QR code readers require a contrast ratio of at least 3:1 (4.5:1 recommended).
 */
export function checkContrast(fgHex: string, bgHex: string): ContrastCheckResult {
  const lum1 = getLuminance(fgHex);
  const lum2 = getLuminance(bgHex);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);

  if (ratio < 2.5) {
    return {
      ratio: Math.round(ratio * 10) / 10,
      isAccessible: false,
      warning: 'Low contrast detected. Some camera scanners might struggle to read this code.',
    };
  } else if (lum1 > lum2) {
    return {
      ratio: Math.round(ratio * 10) / 10,
      isAccessible: true,
      warning: 'Inverted colors (light QR on dark background). Most modern scanners support this, but standard light background offers best reliability.',
    };
  }

  return {
    ratio: Math.round(ratio * 10) / 10,
    isAccessible: true,
  };
}


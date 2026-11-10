import type { SavedQRCode, QRHistorySortOrder } from '../types';
import type { QRContentType } from '../../qr-generator/types';

const STORAGE_KEY = 'qr_studio_saved_codes_v1';

/**
 * Checks if browser LocalStorage is available.
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__qr_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resizes and compresses a data URL image to avoid quota exceeded errors.
 * Fits within 128x128px for compact logo persistence.
 */
export async function compressImageDataUrl(dataUrl: string, maxDim: number = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png', 0.85));
    };
    img.onerror = () => reject(new Error('Failed to compress image.'));
    img.src = dataUrl;
  });
}

/**
 * Retrieves all saved QR codes from LocalStorage.
 */
export function getAllSavedQRCodes(): SavedQRCode[] {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage is not available in this environment.');
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.error('Error reading saved QR codes from LocalStorage:', err);
    return [];
  }
}

/**
 * Retrieves a single QR code by ID.
 */
export function getSavedQRCodeById(id: string): SavedQRCode | null {
  const all = getAllSavedQRCodes();
  return all.find((item) => item.id === id) || null;
}

/**
 * Saves a new QR code or updates an existing one if ID matches.
 */
export async function saveQRCode(qr: SavedQRCode): Promise<{ success: boolean; error?: string }> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: 'LocalStorage is unavailable or blocked in this browser.' };
  }

  try {
    const all = getAllSavedQRCodes();
    const existingIndex = all.findIndex((item) => item.id === qr.id);

    // If logo data url exists, compress it to avoid filling storage
    let processedQr = { ...qr };
    if (processedQr.logoDataUrl && processedQr.logoDataUrl.length > 50000) {
      try {
        processedQr.logoDataUrl = await compressImageDataUrl(processedQr.logoDataUrl, 96);
      } catch {
        // Keep original if compression fails
      }
    }

    // Compress thumbnail
    if (processedQr.thumbnailUrl && processedQr.thumbnailUrl.length > 40000) {
      try {
        processedQr.thumbnailUrl = await compressImageDataUrl(processedQr.thumbnailUrl, 160);
      } catch {
        // Keep original
      }
    }

    if (existingIndex >= 0) {
      all[existingIndex] = {
        ...processedQr,
        updatedAt: new Date().toISOString(),
      };
    } else {
      all.unshift({
        ...processedQr,
        createdAt: processedQr.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true };
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    if (isQuota) {
      return {
        success: false,
        error: 'Storage quota exceeded. Please delete some older saved QR codes or remove large logos.',
      };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Unknown storage error.' };
  }
}

/**
 * Updates an existing QR code.
 */
export async function updateQRCode(
  id: string,
  updates: Partial<SavedQRCode>
): Promise<{ success: boolean; error?: string }> {
  const existing = getSavedQRCodeById(id);
  if (!existing) {
    return { success: false, error: `QR Code with ID "${id}" not found.` };
  }
  const merged: SavedQRCode = {
    ...existing,
    ...updates,
    id, // lock ID
    updatedAt: new Date().toISOString(),
  };
  return saveQRCode(merged);
}

/**
 * Deletes a single QR code by ID.
 */
export function deleteQRCode(id: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    const all = getAllSavedQRCodes();
    const filtered = all.filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all saved QR codes.
 */
export function clearAllQRCodes(): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Searches and filters saved QR codes with sorting.
 */
export function searchAndFilterQRCodes(
  items: SavedQRCode[],
  query: string,
  typeFilter: string,
  sortOrder: QRHistorySortOrder
): SavedQRCode[] {
  let result = [...items];

  // 1. Text Search (name or content)
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (item) => item.name.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
    );
  }

  // 2. Type Filter
  if (typeFilter && typeFilter !== 'all') {
    result = result.filter((item) => item.type === (typeFilter as QRContentType));
  }

  // 3. Sorting
  result.sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return result;
}

/**
 * Exports all saved QR history as a formatted JSON string.
 */
export function exportHistoryAsJSON(): string {
  const items = getAllSavedQRCodes();
  const exportPayload = {
    app: 'QR Studio',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    totalCodes: items.length,
    codes: items,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Validates and imports a JSON backup into LocalStorage.
 * Prevents ID collisions and validates schema.
 */
export function importHistoryFromJSON(jsonString: string): {
  success: boolean;
  importedCount: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const incoming: SavedQRCode[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.codes)
      ? parsed.codes
      : null;

    if (!incoming || incoming.length === 0) {
      return { success: false, importedCount: 0, error: 'JSON does not contain any valid QR code entries.' };
    }

    const current = getAllSavedQRCodes();
    const currentIdSet = new Set(current.map((c) => c.id));
    let count = 0;

    for (const item of incoming) {
      // Validate required fields
      if (!item.name || !item.type || !item.content) {
        continue;
      }

      let uniqueId = item.id;
      if (!uniqueId || currentIdSet.has(uniqueId)) {
        uniqueId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }

      currentIdSet.add(uniqueId);
      current.unshift({
        ...item,
        id: uniqueId,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return { success: true, importedCount: count };
  } catch (err) {
    return {
      success: false,
      importedCount: 0,
      error: err instanceof Error ? err.message : 'Invalid JSON file structure.',
    };
  }
}


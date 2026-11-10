import { useState, useEffect, useCallback } from 'react';
import type { SavedQRCode, QRHistorySortOrder } from '../types';
import {
  getAllSavedQRCodes,
  saveQRCode,
  deleteQRCode,
  clearAllQRCodes,
  searchAndFilterQRCodes,
  exportHistoryAsJSON,
  importHistoryFromJSON,
} from '../utils/qrStorage';

export function useQRHistory() {
  const [items, setItems] = useState<SavedQRCode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<QRHistorySortOrder>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Load from local storage
  const refresh = useCallback(() => {
    setIsLoading(true);
    const loaded = getAllSavedQRCodes();
    setItems(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Save or update
  const save = useCallback(
    async (qr: SavedQRCode): Promise<{ success: boolean; error?: string }> => {
      setStorageError(null);
      const res = await saveQRCode(qr);
      if (res.success) {
        refresh();
      } else {
        setStorageError(res.error || 'Failed to save QR Code.');
      }
      return res;
    },
    [refresh]
  );

  // Delete single
  const remove = useCallback(
    (id: string): boolean => {
      const ok = deleteQRCode(id);
      if (ok) refresh();
      return ok;
    },
    [refresh]
  );

  // Clear all
  const clearAll = useCallback((): boolean => {
    const ok = clearAllQRCodes();
    if (ok) refresh();
    return ok;
  }, [refresh]);

  // Export JSON
  const exportJSON = useCallback(() => {
    const json = exportHistoryAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Import JSON
  const importJSON = useCallback(
    (jsonString: string): { success: boolean; importedCount: number; error?: string } => {
      const result = importHistoryFromJSON(jsonString);
      if (result.success) {
        refresh();
      }
      return result;
    },
    [refresh]
  );

  // Filtered & sorted view
  const filteredItems = searchAndFilterQRCodes(items, searchQuery, typeFilter, sortOrder);

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    isLoading,
    storageError,
    save,
    remove,
    clearAll,
    exportJSON,
    importJSON,
    refresh,
  };
}


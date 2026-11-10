import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types';
import { getSavedSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/settingsStorage';
import { useTheme } from '../../../hooks/useTheme';

export function useAppSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(getSavedSettings);
  const { setTheme: setSystemTheme } = useTheme();

  // Sync theme changes with ThemeProvider
  useEffect(() => {
    setSystemTheme(settings.theme);
  }, [settings.theme, setSystemTheme]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}


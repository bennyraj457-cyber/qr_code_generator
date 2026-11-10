import type { AppSettings } from '../types';

const SETTINGS_KEY = 'qr_studio_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultSize: 512,
  defaultErrorCorrection: 'H',
  defaultFgColor: '#4F46E5',
  defaultBgColor: '#FFFFFF',
  rememberLastType: true,
  lastSelectedType: 'url',
  showInstallInstructions: true,
};

export function getSavedSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}


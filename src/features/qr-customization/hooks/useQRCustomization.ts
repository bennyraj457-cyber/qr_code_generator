import { useState, useCallback } from 'react';
import type { QRCustomizationState, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from '../types';
import { COLOR_PRESETS } from '../utils/colorPresets';

export const DEFAULT_CUSTOMIZATION: QRCustomizationState = {
  fgColor: '#4F46E5', // Electric Indigo
  bgColor: '#FFFFFF', // Clean White
  size: 512,
  errorCorrectionLevel: 'H',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoDataUrl: null,
  logoFileName: null,
  logoSizePercent: 0.25,
};

export function useQRCustomization() {
  const [customization, setCustomization] = useState<QRCustomizationState>(DEFAULT_CUSTOMIZATION);
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);

  const setFgColor = useCallback((color: string) => {
    setCustomization((prev) => ({ ...prev, fgColor: color }));
  }, []);

  const setBgColor = useCallback((color: string) => {
    setCustomization((prev) => ({ ...prev, bgColor: color }));
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = COLOR_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCustomization((prev) => ({
        ...prev,
        fgColor: preset.fgColor,
        bgColor: preset.bgColor,
      }));
    }
  }, []);

  const resetColors = useCallback(() => {
    setCustomization((prev) => ({
      ...prev,
      fgColor: DEFAULT_CUSTOMIZATION.fgColor,
      bgColor: DEFAULT_CUSTOMIZATION.bgColor,
    }));
  }, []);

  const setSize = useCallback((size: number) => {
    const clamped = Math.max(128, Math.min(2048, size));
    setCustomization((prev) => ({ ...prev, size: clamped }));
  }, []);

  const setErrorCorrection = useCallback((level: ErrorCorrectionLevel) => {
    setCustomization((prev) => ({ ...prev, errorCorrectionLevel: level }));
  }, []);

  const setDotType = useCallback((type: DotType) => {
    setCustomization((prev) => ({ ...prev, dotType: type }));
  }, []);

  const setCornerSquareType = useCallback((type: CornerSquareType) => {
    setCustomization((prev) => ({ ...prev, cornerSquareType: type }));
  }, []);

  const setCornerDotType = useCallback((type: CornerDotType) => {
    setCustomization((prev) => ({ ...prev, cornerDotType: type }));
  }, []);

  const setLogo = useCallback((dataUrl: string | null, fileName: string | null) => {
    setCustomization((prev) => ({
      ...prev,
      logoDataUrl: dataUrl,
      logoFileName: fileName,
      // Auto enforce High error correction level when a logo is applied
      errorCorrectionLevel: dataUrl ? 'H' : prev.errorCorrectionLevel,
    }));
  }, []);

  const setLogoSize = useCallback((percent: number) => {
    const clamped = Math.max(0.15, Math.min(0.35, percent));
    setCustomization((prev) => ({ ...prev, logoSizePercent: clamped }));
  }, []);

  const resetAll = useCallback(() => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    setIsCustomSize(false);
  }, []);

  return {
    customization,
    isCustomSize,
    setIsCustomSize,
    setFgColor,
    setBgColor,
    applyPreset,
    resetColors,
    setSize,
    setErrorCorrection,
    setDotType,
    setCornerSquareType,
    setCornerDotType,
    setLogo,
    setLogoSize,
    resetAll,
  };
}


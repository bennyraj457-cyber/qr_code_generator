export type DotType = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotType = 'square' | 'dot';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface ColorPreset {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
  description: string;
}

export interface QRCustomizationState {
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  logoDataUrl: string | null;
  logoFileName: string | null;
  logoSizePercent: number; // typically 0.2 to 0.35
}

export interface ContrastCheckResult {
  ratio: number;
  isAccessible: boolean;
  warning?: string;
}


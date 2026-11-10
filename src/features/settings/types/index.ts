import type { ThemeMode } from '../../../types';
import type { ErrorCorrectionLevel } from '../../qr-customization/types';
import type { QRContentType } from '../../qr-generator/types';

export interface AppSettings {
  theme: ThemeMode;
  defaultSize: number;
  defaultErrorCorrection: ErrorCorrectionLevel;
  defaultFgColor: string;
  defaultBgColor: string;
  rememberLastType: boolean;
  lastSelectedType: QRContentType;
  showInstallInstructions: boolean;
}


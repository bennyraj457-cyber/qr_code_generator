import type { QRContentType, QRPayloadUnion } from '../../qr-generator/types';

export type TemplateCategory =
  | 'All'
  | 'Web & Links'
  | 'Social Media'
  | 'Connectivity'
  | 'Communication'
  | 'Contact & Info';

export interface QRTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  qrType: QRContentType;
  description: string;
  iconName: string;
  badge?: string;
  exampleData: QRPayloadUnion['data'];
  defaultColors?: {
    fg: string;
    bg: string;
  };
}


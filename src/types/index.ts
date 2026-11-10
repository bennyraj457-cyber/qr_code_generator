export type ThemeMode = 'light' | 'dark' | 'system';

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface QRCodeDataPlaceholder {
  id: string;
  name: string;
  type: 'url' | 'text' | 'wifi' | 'vcard' | 'email';
  content: string;
  createdAt: string;
}


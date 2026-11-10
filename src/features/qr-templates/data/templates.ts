import type { QRTemplate } from '../types';

export const QR_TEMPLATES: QRTemplate[] = [
  // 1. Website
  {
    id: 'template-website',
    name: 'Website & Landing Page',
    category: 'Web & Links',
    qrType: 'url',
    description: 'Direct users to your company website, landing page, or online storefront.',
    iconName: 'Globe',
    badge: 'Popular',
    exampleData: {
      url: 'https://example.com/welcome',
    },
    defaultColors: {
      fg: '#4F46E5',
      bg: '#FFFFFF',
    },
  },

  // 2. Wi-Fi
  {
    id: 'template-wifi',
    name: 'Guest Wi-Fi Network',
    category: 'Connectivity',
    qrType: 'wifi',
    description: 'Instant wireless connection card for cafes, offices, Airbnbs and homes.',
    iconName: 'Wifi',
    badge: 'Instant Connect',
    exampleData: {
      ssid: 'Cafe_Guest_WiFi_5G',
      password: 'CoffeeEnjoy2026',
      security: 'WPA',
      hidden: false,
    },
    defaultColors: {
      fg: '#0EA5E9',
      bg: '#F0F9FF',
    },
  },

  // 3. WhatsApp
  {
    id: 'template-whatsapp',
    name: 'WhatsApp Direct Chat',
    category: 'Communication',
    qrType: 'whatsapp',
    description: 'Start a direct chat with your business or support team with a pre-filled greeting.',
    iconName: 'MessageCircle',
    badge: 'One-Tap Chat',
    exampleData: {
      countryCode: '+1',
      phone: '5554321098',
      message: 'Hi! I would like to inquire about your services.',
    },
    defaultColors: {
      fg: '#005338',
      bg: '#F2FDF7',
    },
  },

  // 4. Email
  {
    id: 'template-email',
    name: 'Email Template',
    category: 'Communication',
    qrType: 'email',
    description: 'Pre-compose an email with target address, subject line and inquiry template.',
    iconName: 'Mail',
    exampleData: {
      email: 'support@example.com',
      subject: 'Inquiry from QR Code',
      body: 'Hello Support Team,\n\nI have a question regarding...',
    },
    defaultColors: {
      fg: '#4F46E5',
      bg: '#FFFFFF',
    },
  },

  // 5. Phone
  {
    id: 'template-phone',
    name: 'Phone Call Dial',
    category: 'Communication',
    qrType: 'phone',
    description: 'Immediate click-to-dial telephone hotline for customer service or sales.',
    iconName: 'Phone',
    exampleData: {
      phone: '+1 (800) 555-0199',
    },
    defaultColors: {
      fg: '#0284C7',
      bg: '#FFFFFF',
    },
  },

  // 6. SMS
  {
    id: 'template-sms',
    name: 'SMS Text Message',
    category: 'Communication',
    qrType: 'sms',
    description: 'Pre-addressed mobile text message for contests, keywords or verification.',
    iconName: 'MessageSquare',
    exampleData: {
      phone: '+1 (555) 789-0123',
      message: 'START - Subscribe me to weekly updates.',
    },
    defaultColors: {
      fg: '#4338CA',
      bg: '#FFFFFF',
    },
  },

  // 7. Contact Card (vCard)
  {
    id: 'template-vcard',
    name: 'vCard Digital Business Card',
    category: 'Contact & Info',
    qrType: 'vcard',
    description: 'Complete digital contact card that instantly saves to smartphone contacts.',
    iconName: 'Contact',
    badge: 'Networking',
    exampleData: {
      name: 'Morgan Taylor',
      phone: '+1 (555) 890-1234',
      email: 'morgan.taylor@company.com',
      organization: 'Vanguard Design Studio',
      website: 'https://morgantaylor.design',
    },
    defaultColors: {
      fg: '#0B1C30',
      bg: '#FFFFFF',
    },
  },

  // 8. Instagram
  {
    id: 'template-instagram',
    name: 'Instagram Profile',
    category: 'Social Media',
    qrType: 'url',
    description: 'Grow your followers by linking directly to your Instagram profile or brand page.',
    iconName: 'Instagram',
    badge: 'Social',
    exampleData: {
      url: 'https://instagram.com/qrstudioapp',
    },
    defaultColors: {
      fg: '#881337',
      bg: '#FFF1F2',
    },
  },

  // 9. Facebook
  {
    id: 'template-facebook',
    name: 'Facebook Page',
    category: 'Social Media',
    qrType: 'url',
    description: 'Link fans directly to your Facebook brand page, event or community group.',
    iconName: 'Facebook',
    badge: 'Social',
    exampleData: {
      url: 'https://facebook.com/qrstudioapp',
    },
    defaultColors: {
      fg: '#1877F2',
      bg: '#FFFFFF',
    },
  },

  // 10. YouTube
  {
    id: 'template-youtube',
    name: 'YouTube Video & Channel',
    category: 'Social Media',
    qrType: 'url',
    description: 'Direct viewers straight to your channel subscribe page or featured video.',
    iconName: 'Youtube',
    badge: 'Video',
    exampleData: {
      url: 'https://youtube.com/@qrstudioapp',
    },
    defaultColors: {
      fg: '#DC2626',
      bg: '#FFFFFF',
    },
  },

  // 11. Location
  {
    id: 'template-location',
    name: 'Map Location / Coordinates',
    category: 'Contact & Info',
    qrType: 'location',
    description: 'Open Google Maps or Apple Maps to guide customers directly to your storefront.',
    iconName: 'MapPin',
    badge: 'Navigation',
    exampleData: {
      latitude: '37.7749',
      longitude: '-122.4194',
      query: 'San Francisco, CA',
    },
    defaultColors: {
      fg: '#005338',
      bg: '#F2FDF7',
    },
  },

  // 12. Plain Text
  {
    id: 'template-text',
    name: 'Plain Text Note / Coupon',
    category: 'Contact & Info',
    qrType: 'text',
    description: 'Display discount promo codes, Wi-Fi notes, serial numbers, or instructions.',
    iconName: 'Type',
    exampleData: {
      text: 'SPECIAL PROMO: Use code QRSTUDIO25 at checkout for 25% off!',
    },
    defaultColors: {
      fg: '#000000',
      bg: '#FFFFFF',
    },
  },
];


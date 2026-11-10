import React from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export const AboutPage: React.FC<{ onNavigateToGenerator?: () => void }> = ({
  onNavigateToGenerator,
}) => {
  const supportedTypes = [
    { title: 'Website URLs', desc: 'Landing pages, portfolios, social trees & payment links' },
    { title: 'Plain Text', desc: 'Notes, addresses, coupons, tokens and instructions' },
    { title: 'Wi-Fi Networks', desc: 'One-scan instant network credentials connection' },
    { title: 'Email Templates', desc: 'Pre-addressed messages with subject and body' },
    { title: 'Phone Numbers', desc: 'Direct dial telephone numbers on any smartphone' },
    { title: 'SMS Messages', desc: 'Pre-addressed mobile SMS with preset content' },
    { title: 'WhatsApp Direct', desc: 'Instant WhatsApp chat initiation without saving contacts' },
    { title: 'vCard 3.0 Contacts', desc: 'Complete digital address book business cards' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Payload Type',
      description: 'Select between Website URL, Wi-Fi, vCard, WhatsApp, SMS, Email, or Plain text.',
    },
    {
      step: '02',
      title: 'Enter Your Details',
      description: 'Fill in your target information into the dedicated, validated form inputs.',
    },
    {
      step: '03',
      title: 'Customize Styling',
      description: 'Tailor foreground colors, canvas background, matrix dot shapes, and add your logo.',
    },
    {
      step: '04',
      title: 'Instant Export',
      description: 'Download crisp raster PNG or infinitely scalable SVG vector files ready for print.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* 1. Hero Section */}
      <div className="flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            About QR Studio
          </Badge>
          <span className="text-xs text-on-surface-muted font-mono">Progressive Web App</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
          High-Precision QR Code Generation for Modern Creators
        </h1>
        <p className="text-sm sm:text-base text-on-surface-muted leading-relaxed max-w-2xl">
          QR Studio is a fast, privacy-first Progressive Web App designed to create scannable,
          customizable vector and raster QR codes without external tracking or subscription lock-in.
        </p>
      </div>

      {/* 2. Privacy-First & Offline Philosophy Card */}
      <Card level={2} className="p-6 sm:p-8 flex flex-col gap-5 border-l-4 border-l-primary-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              100% Privacy-First, Browser-Based Approach
            </h2>
            <p className="text-xs text-on-surface-muted">
              Zero server logging • No analytics snooping • Pure client execution
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Unlike common online QR code generators that route your users through redirect tracking
          links or store your Wi-Fi credentials on remote servers, QR Studio generates codes strictly
          inside your browser's local sandbox memory. What you type stays on your device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Direct payload embedding (no intermediate redirect servers)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Wi-Fi passwords remain strictly private on-device</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Engineered with Progressive Web App (PWA) architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Designed for future offline browser standalone functionality</span>
          </div>
        </div>
      </Card>

      {/* 3. Supported QR Code Types */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-on-surface">Supported QR Code Types</h2>
          <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">
            QR Studio provides tailored input panels and standard encoding for eight primary formats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedTypes.map((item, idx) => (
            <Card key={idx} level={1} className="p-4 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-primary-600">0{idx + 1}</span>
              <h3 className="text-sm font-bold text-on-surface">{item.title}</h3>
              <p className="text-xs text-on-surface-muted">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. How to Use the Application */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-on-surface">How to Use QR Studio</h2>
          <p className="text-xs sm:text-sm text-on-surface-muted mt-0.5">
            Get your barcode ready for production in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-surface-base border border-subdued shadow-level-1 flex flex-col gap-2 relative"
            >
              <span className="text-2xl font-black text-primary-600/30 font-mono">{s.step}</span>
              <h3 className="text-sm font-bold text-on-surface">{s.title}</h3>
              <p className="text-xs text-on-surface-muted leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Call to Action */}
      {onNavigateToGenerator && (
        <Card level={2} className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary-500/10 via-surface-base to-secondary-500/10 border-primary-500/20">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-on-surface">
              Ready to create your first QR Code?
            </h3>
            <p className="text-xs text-on-surface-muted">
              Launch the studio editor and preview your custom code in real-time.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onNavigateToGenerator}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Launch Studio Generator
          </Button>
        </Card>
      )}
    </div>
  );
};

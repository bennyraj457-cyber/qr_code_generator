import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Type,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Contact,
  MapPin,
  Sparkles,
  Download,
  Copy,
  Share2,
  Check,
  Eye,
  Sliders,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Save,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Badge,
  Modal,
} from '../components/ui';
import { cn } from '../utils/cn';
import {
  type QRContentType,
  type QRPayloadUnion,
  buildQRContent,
  validatePayload,
  downloadFile,
} from '../features/qr-generator';
import {
  useQRCustomization,
  CustomizationPanel,
  generateStyledQRCode,
  checkContrast,
} from '../features/qr-customization';
import { useQRHistory, type SavedQRCode } from '../features/qr-history';
import type { QRTemplate } from '../features/qr-templates';

interface QRGeneratorPageProps {
  editingItem?: SavedQRCode | null;
  selectedTemplate?: QRTemplate | null;
  initialContentType?: QRContentType | null;
  onClearEditing?: () => void;
  onClearTemplate?: () => void;
  onNavigateToHistory?: () => void;
}

export const QRGeneratorPage: React.FC<QRGeneratorPageProps> = ({
  editingItem,
  selectedTemplate,
  initialContentType,
  onClearEditing,
  onClearTemplate,
}) => {
  // Selected Content Type
  const [contentType, setContentType] = useState<QRContentType>(() => initialContentType || 'url');

  useEffect(() => {
    if (initialContentType) {
      setContentType(initialContentType);
    }
  }, [initialContentType]);

  // Customization Hook
  const {
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
    resetAll,
  } = useQRCustomization();

  // QR History Hook
  const { save: saveToHistory } = useQRHistory();

  // Active QR Editing tracking
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [qrName, setQrName] = useState<string>('My QR Code');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generated QR output state
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [rawPayload, setRawPayload] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // User feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  // Form State: Website URL
  const [url, setUrl] = useState('https://qrstudio.app');
  const [urlTouched, setUrlTouched] = useState(false);

  // Form State: Plain Text
  const [plainText, setPlainText] = useState('Welcome to QR Studio! Scan me.');

  // Form State: Wi-Fi
  const [wifiSsid, setWifiSsid] = useState('Office_Network_5G');
  const [wifiPassword, setWifiPassword] = useState('SuperSecretPassword');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Form State: Email
  const [emailAddress, setEmailAddress] = useState('hello@qrstudio.app');
  const [emailSubject, setEmailSubject] = useState('Project Inquiry');
  const [emailBody, setEmailBody] = useState('Hi team, I would like to learn more about QR Studio.');

  // Form State: Phone
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');

  // Form State: SMS
  const [smsPhone, setSmsPhone] = useState('+1 (555) 987-6543');
  const [smsMessage, setSmsMessage] = useState('Hello from QR Studio!');

  // Form State: WhatsApp
  const [waCountryCode, setWaCountryCode] = useState('+1');
  const [waPhone, setWaPhone] = useState('5554321098');
  const [waMessage, setWaMessage] = useState('Hi! Connecting from your custom QR Code.');

  // Form State: Contact (vCard)
  const [vcardName, setVcardName] = useState('Alex Morgan');
  const [vcardPhone, setVcardPhone] = useState('+1 (555) 876-5432');
  const [vcardEmail, setVcardEmail] = useState('alex.morgan@designstudio.io');
  const [vcardOrg, setVcardOrg] = useState('Creative Technologies Inc.');
  const [vcardWebsite, setVcardWebsite] = useState('https://alexmorgan.design');

  // Form State: Location
  const [locLat, setLocLat] = useState('37.7749');
  const [locLng, setLocLng] = useState('-122.4194');
  const [locQuery, setLocQuery] = useState('San Francisco, CA');

  // Content Type Tab Configuration
  const contentTypes = [
    { id: 'url', label: 'Website URL', icon: Globe, desc: 'Link to any website or landing page' },
    { id: 'text', label: 'Plain Text', icon: Type, desc: 'Display text or notes directly' },
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi, desc: 'Instant wireless network connection' },
    { id: 'email', label: 'Email', icon: Mail, desc: 'Pre-compose email with subject & body' },
    { id: 'phone', label: 'Phone', icon: Phone, desc: 'One-tap dial phone number' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Pre-addressed mobile SMS message' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Direct WhatsApp chat launcher' },
    { id: 'vcard', label: 'Contact', icon: Contact, desc: 'Full vCard address book contact' },
    { id: 'location', label: 'Location', icon: MapPin, desc: 'Map coordinates & navigation' },
  ] as const;

  // Load selectedTemplate when chosen from Templates page
  useEffect(() => {
    if (selectedTemplate) {
      setCurrentEditingId(null);
      setQrName(selectedTemplate.name);
      setContentType(selectedTemplate.qrType);

      if (selectedTemplate.defaultColors) {
        setFgColor(selectedTemplate.defaultColors.fg);
        setBgColor(selectedTemplate.defaultColors.bg);
      }

      // Pre-fill example data for user customization
      const p = selectedTemplate.exampleData as any;
      if (p) {
        if (selectedTemplate.qrType === 'url') setUrl(p.url || '');
        if (selectedTemplate.qrType === 'text') setPlainText(p.text || '');
        if (selectedTemplate.qrType === 'wifi') {
          setWifiSsid(p.ssid || '');
          setWifiPassword(p.password || '');
          setWifiSecurity(p.security || 'WPA');
          setWifiHidden(Boolean(p.hidden));
        }
        if (selectedTemplate.qrType === 'email') {
          setEmailAddress(p.email || '');
          setEmailSubject(p.subject || '');
          setEmailBody(p.body || '');
        }
        if (selectedTemplate.qrType === 'phone') setPhoneNumber(p.phone || '');
        if (selectedTemplate.qrType === 'sms') {
          setSmsPhone(p.phone || '');
          setSmsMessage(p.message || '');
        }
        if (selectedTemplate.qrType === 'whatsapp') {
          setWaCountryCode(p.countryCode || '+1');
          setWaPhone(p.phone || '');
          setWaMessage(p.message || '');
        }
        if (selectedTemplate.qrType === 'vcard') {
          setVcardName(p.name || '');
          setVcardPhone(p.phone || '');
          setVcardEmail(p.email || '');
          setVcardOrg(p.organization || '');
          setVcardWebsite(p.website || '');
        }
        if (selectedTemplate.qrType === 'location') {
          setLocLat(p.latitude || '37.7749');
          setLocLng(p.longitude || '-122.4194');
          setLocQuery(p.query || '');
        }
      }
    }
  }, [
    selectedTemplate,
    setFgColor,
    setBgColor,
  ]);
  useEffect(() => {
    if (editingItem) {
      setCurrentEditingId(editingItem.id);
      setQrName(editingItem.name);
      setContentType(editingItem.type);
      setFgColor(editingItem.fgColor);
      setBgColor(editingItem.bgColor);
      setSize(editingItem.size);
      setErrorCorrection(editingItem.errorCorrectionLevel);
      setDotType(editingItem.dotType);
      setCornerSquareType(editingItem.cornerSquareType);
      setCornerDotType(editingItem.cornerDotType);
      if (editingItem.logoDataUrl) {
        setLogo(editingItem.logoDataUrl, editingItem.logoFileName || null);
      }

      // Restore form fields
      const p = editingItem.payloadData as any;
      if (p) {
        if (editingItem.type === 'url') setUrl(p.url || '');
        if (editingItem.type === 'text') setPlainText(p.text || '');
        if (editingItem.type === 'wifi') {
          setWifiSsid(p.ssid || '');
          setWifiPassword(p.password || '');
          setWifiSecurity(p.security || 'WPA');
          setWifiHidden(Boolean(p.hidden));
        }
        if (editingItem.type === 'email') {
          setEmailAddress(p.email || '');
          setEmailSubject(p.subject || '');
          setEmailBody(p.body || '');
        }
        if (editingItem.type === 'phone') setPhoneNumber(p.phone || '');
        if (editingItem.type === 'sms') {
          setSmsPhone(p.phone || '');
          setSmsMessage(p.message || '');
        }
        if (editingItem.type === 'whatsapp') {
          setWaCountryCode(p.countryCode || '+1');
          setWaPhone(p.phone || '');
          setWaMessage(p.message || '');
        }
        if (editingItem.type === 'vcard') {
          setVcardName(p.name || '');
          setVcardPhone(p.phone || '');
          setVcardEmail(p.email || '');
          setVcardOrg(p.organization || '');
          setVcardWebsite(p.website || '');
        }
        if (editingItem.type === 'location') {
          setLocLat(p.latitude || '37.7749');
          setLocLng(p.longitude || '-122.4194');
          setLocQuery(p.query || '');
        }
      }
    }
  }, [
    editingItem,
    setFgColor,
    setBgColor,
    setSize,
    setErrorCorrection,
    setDotType,
    setCornerSquareType,
    setCornerDotType,
    setLogo,
  ]);

  // Build active payload
  const getCurrentPayload = useCallback((): QRPayloadUnion => {
    switch (contentType) {
      case 'url':
        return { type: 'url', data: { url } };
      case 'text':
        return { type: 'text', data: { text: plainText } };
      case 'wifi':
        return {
          type: 'wifi',
          data: {
            ssid: wifiSsid,
            password: wifiPassword,
            security: wifiSecurity,
            hidden: wifiHidden,
          },
        };
      case 'email':
        return {
          type: 'email',
          data: {
            email: emailAddress,
            subject: emailSubject,
            body: emailBody,
          },
        };
      case 'phone':
        return { type: 'phone', data: { phone: phoneNumber } };
      case 'sms':
        return { type: 'sms', data: { phone: smsPhone, message: smsMessage } };
      case 'whatsapp':
        return {
          type: 'whatsapp',
          data: {
            countryCode: waCountryCode,
            phone: waPhone,
            message: waMessage,
          },
        };
      case 'vcard':
        return {
          type: 'vcard',
          data: {
            name: vcardName,
            phone: vcardPhone,
            email: vcardEmail,
            organization: vcardOrg,
            website: vcardWebsite,
          },
        };
      case 'location':
        return {
          type: 'location',
          data: {
            latitude: locLat,
            longitude: locLng,
            query: locQuery,
          },
        };
    }
  }, [
    contentType,
    url,
    plainText,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
    emailAddress,
    emailSubject,
    emailBody,
    phoneNumber,
    smsPhone,
    smsMessage,
    waCountryCode,
    waPhone,
    waMessage,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
    vcardWebsite,
    locLat,
    locLng,
    locQuery,
  ]);

  // Generate QR Code with active customization state
  const handleGenerate = useCallback(async () => {
    setValidationError(null);
    setGenerationError(null);

    const payload = getCurrentPayload();
    const validation = validatePayload(payload);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid form input.');
      return;
    }

    const content = buildQRContent(payload);
    setRawPayload(content);

    setIsLoading(true);
    try {
      const result = await generateStyledQRCode(content, customization);
      setPngDataUrl(result.pngDataUrl);
      setSvgString(result.svgString);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate styled QR code.';
      setGenerationError(message);
      setIsLoading(false);
    }
  }, [getCurrentPayload, customization]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Save to LocalStorage
  const handleSaveQR = async () => {
    const payload = getCurrentPayload();
    const content = rawPayload || buildQRContent(payload);

    const uniqueId =
      currentEditingId || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const savedRecord: SavedQRCode = {
      id: uniqueId,
      name: qrName.trim() || `${contentType.toUpperCase()} QR Code`,
      type: contentType,
      content,
      payloadData: payload.data,
      fgColor: customization.fgColor,
      bgColor: customization.bgColor,
      size: customization.size,
      errorCorrectionLevel: customization.errorCorrectionLevel,
      dotType: customization.dotType,
      cornerSquareType: customization.cornerSquareType,
      cornerDotType: customization.cornerDotType,
      logoDataUrl: customization.logoDataUrl,
      logoFileName: customization.logoFileName,
      thumbnailUrl: pngDataUrl,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await saveToHistory(savedRecord);
    if (res.success) {
      setCurrentEditingId(uniqueId);
      setSaveSuccess(true);
      setIsSaveModalOpen(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(`Error saving to storage: ${res.error}`);
    }
  };

  const handleCopy = async () => {
    if (!rawPayload) return;
    try {
      await navigator.clipboard.writeText(rawPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share && pngDataUrl) {
      try {
        const res = await fetch(pngDataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'qr-studio-code.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `QR Studio - ${contentType.toUpperCase()}`,
            files: [file],
          });
          setShared(true);
          setTimeout(() => setShared(false), 2000);
          return;
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    handleCopy();
  };

  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    const filename = `qr-${contentType}-${customization.size}px-${Date.now()}.png`;
    downloadFile(pngDataUrl, filename, true);
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;
    const filename = `qr-${contentType}-${Date.now()}.svg`;
    downloadFile(svgString, filename, false);
  };

  const isValidUrl = (val: string) => {
    try {
      const full = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
      new URL(full);
      return true;
    } catch {
      return false;
    }
  };

  const contrastResult = checkContrast(customization.fgColor, customization.bgColor);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* 1. Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              {currentEditingId
                ? `Editing: ${qrName}`
                : selectedTemplate
                ? `Template: ${selectedTemplate.name}`
                : 'Create Your QR Code'}
            </h1>
            <Badge variant="primary" size="sm">
              {currentEditingId ? 'Editing Record' : selectedTemplate ? 'Template Mode' : 'Live Engine'}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-on-surface-muted mt-1">
            {selectedTemplate
              ? `Customizing ${selectedTemplate.name}. Replace example data below and generate your code.`
              : 'Generate beautiful, customizable QR codes with 100% private local persistence.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentEditingId && onClearEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClearEditing();
                setCurrentEditingId(null);
                setQrName('My QR Code');
              }}
            >
              Clear Editing Mode
            </Button>
          )}

          {selectedTemplate && onClearTemplate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClearTemplate();
                setQrName('My QR Code');
              }}
            >
              Clear Template
            </Button>
          )}
        </div>
      </div>

      {/* 2. Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (Desktop 7 Cols): Content Selection, Inputs & Customization Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Card A: Content Type Selector */}
          <Card level={1} className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-subdued pb-3">
              <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary-600" />
                Select Content Type
              </span>
              <span className="text-xs text-on-surface-muted font-mono">8 Formats</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = contentType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 min-h-[76px] cursor-pointer group',
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-600 text-primary-600 shadow-level-1 ring-1 ring-primary-600/30'
                        : 'bg-surface-base border-subdued text-on-surface hover:bg-surface-raised hover:border-strong'
                    )}
                    aria-pressed={isSelected}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 shrink-0',
                        isSelected ? 'text-primary-600' : 'text-on-surface-variant'
                      )}
                    />
                    <span className="text-xs font-semibold leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Card B: Dynamic Payload Form Inputs */}
          <Card level={1} className="p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-subdued pb-3">
              <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-600" />
                Configure Payload Details
              </span>
              <Badge variant="secondary" size="sm">
                {contentTypes.find((t) => t.id === contentType)?.label}
              </Badge>
            </div>

            {/* Error banners */}
            {(validationError || generationError) && (
              <div className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-error flex items-start gap-2.5 text-xs font-semibold animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError || generationError}</span>
              </div>
            )}

            {/* Forms */}
            {contentType === 'url' && (
              <div className="flex flex-col gap-3">
                <Input
                  label="Website URL"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUrl(e.target.value);
                    setUrlTouched(true);
                  }}
                  leftIcon={<Globe className="w-4 h-4" />}
                  error={urlTouched && !isValidUrl(url) ? 'Please enter a valid URL including http:// or https://' : undefined}
                  helperText="Enter a full destination URL. QR scanners will instantly open this web address."
                />
                {isValidUrl(url) && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Valid web destination detected
                  </p>
                )}
              </div>
            )}

            {contentType === 'text' && (
              <Textarea
                label="Plain Text"
                placeholder="Type or paste any text message, announcement, or code..."
                value={plainText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlainText(e.target.value)}
                rows={5}
                helperText="Characters are directly encoded into the QR matrix. Maximum 2,000 characters."
              />
            )}

            {contentType === 'wifi' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Network Name (SSID)"
                  placeholder="e.g. CoffeeShop_Guest_WiFi"
                  value={wifiSsid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiSsid(e.target.value)}
                  leftIcon={<Wifi className="w-4 h-4" />}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="WPA/WPA2 network key"
                    value={wifiPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiPassword(e.target.value)}
                    disabled={wifiSecurity === 'nopass'}
                  />
                  <Select
                    label="Security Type"
                    value={wifiSecurity}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')
                    }
                    options={[
                      { value: 'WPA', label: 'WPA / WPA2 / WPA3 (Recommended)' },
                      { value: 'WEP', label: 'WEP (Legacy)' },
                      { value: 'nopass', label: 'No Encryption / Open' },
                    ]}
                  />
                </div>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-on-surface cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWifiHidden(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span>This is a hidden network (SSID broadcast disabled)</span>
                </label>
              </div>
            )}

            {contentType === 'email' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailAddress(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Subject Line"
                  placeholder="Inquiry regarding..."
                  value={emailSubject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSubject(e.target.value)}
                />
                <Textarea
                  label="Pre-filled Message Body"
                  placeholder="Write your email template message here..."
                  value={emailBody}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailBody(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {contentType === 'phone' && (
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                helperText="Scanning triggers one-touch direct dialing on smartphones."
              />
            )}

            {contentType === 'sms' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Recipient Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={smsPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSmsPhone(e.target.value)}
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                />
                <Textarea
                  label="Pre-composed SMS Message"
                  placeholder="Type the preset text message to send..."
                  value={smsMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSmsMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {contentType === 'whatsapp' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <Input
                      label="Country Code"
                      placeholder="+1"
                      value={waCountryCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaCountryCode(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="WhatsApp Phone Number"
                      type="tel"
                      placeholder="e.g. 5550192834"
                      value={waPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaPhone(e.target.value)}
                      leftIcon={<MessageCircle className="w-4 h-4" />}
                    />
                  </div>
                </div>
                <Textarea
                  label="Optional Message"
                  placeholder="Hey, I'd like to chat about..."
                  value={waMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWaMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {contentType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    placeholder="Jane Doe"
                    value={vcardName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVcardName(e.target.value)}
                    leftIcon={<Contact className="w-4 h-4" />}
                  />
                </div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={vcardPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVcardPhone(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="jane.doe@company.com"
                  value={vcardEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVcardEmail(e.target.value)}
                />
                <Input
                  label="Organization / Company"
                  placeholder="Acme Design Labs"
                  value={vcardOrg}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVcardOrg(e.target.value)}
                />
                <Input
                  label="Personal / Company Website"
                  placeholder="https://acme.design"
                  value={vcardWebsite}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVcardWebsite(e.target.value)}
                />
              </div>
            )}

            {contentType === 'location' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Location / Place Search Name"
                  placeholder="e.g. San Francisco Golden Gate Bridge"
                  value={locQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocQuery(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  helperText="Search query opens in Google Maps on scan."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Latitude (optional)"
                    placeholder="37.7749"
                    value={locLat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocLat(e.target.value)}
                  />
                  <Input
                    label="Longitude (optional)"
                    placeholder="-122.4194"
                    value={locLng}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocLng(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onClick={handleGenerate}
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                Update / Refresh QR Code
              </Button>
            </div>
          </Card>

          {/* Card C: Complete QR Customization System */}
          <CustomizationPanel
            customization={customization}
            isCustomSize={isCustomSize}
            onSetIsCustomSize={setIsCustomSize}
            onSetFgColor={setFgColor}
            onSetBgColor={setBgColor}
            onApplyPreset={applyPreset}
            onResetColors={resetColors}
            onSetSize={setSize}
            onSetErrorCorrection={setErrorCorrection}
            onSetDotType={setDotType}
            onSetCornerSquareType={setCornerSquareType}
            onSetCornerDotType={setCornerDotType}
            onSetLogo={setLogo}
            onResetAll={resetAll}
          />
        </div>

        {/* Right Column (Desktop 5 Cols): Dedicated Sticky Live Preview Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-20">
          <Card level={2} className="p-5 sm:p-6 flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-subdued mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-on-surface">Live QR Preview</h3>
              </div>
              <Badge variant="primary" size="sm">
                {isLoading ? 'Rendering...' : 'High Fidelity'}
              </Badge>
            </div>

            {/* QR Canvas Container with 4-module quiet zone margin */}
            <div
              className="w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center p-6 shadow-level-1 transition-all duration-200 border border-subdued relative group overflow-hidden rounded-2xl"
              style={{ backgroundColor: customization.bgColor }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-primary-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-semibold">Updating vector matrix...</span>
                </div>
              ) : pngDataUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={pngDataUrl}
                    alt={`Styled QR Code (${contentType})`}
                    className="w-full h-full object-contain select-none transition-transform duration-200"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 text-on-surface-muted gap-2">
                  <AlertCircle className="w-8 h-8 opacity-40 text-on-surface" />
                  <p className="text-xs font-semibold">Ready to Generate</p>
                  <p className="text-[11px] leading-tight">Fill in the fields on the left to create your QR Code.</p>
                </div>
              )}
            </div>

            {/* Resolution and Contrast / Quiet Zone Badge */}
            <div className="w-full flex items-center justify-between text-[11px] text-on-surface-muted mt-3 px-1">
              <span className="font-mono font-bold text-on-surface">
                {customization.size} × {customization.size} px
              </span>
              <span className={cn(
                'flex items-center gap-1 font-medium',
                contrastResult.isAccessible
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              )}>
                <CheckCircle2 className="w-3 h-3" />
                {contrastResult.isAccessible ? 'Optimal Quiet Zone & Contrast' : 'Check Contrast'}
              </span>
            </div>

            {/* Color Swatch Information Bar */}
            <div className="w-full mt-3 p-2.5 rounded-xl bg-surface-raised border border-subdued flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: customization.fgColor }}
                  title="Foreground"
                />
                <span className="font-mono font-semibold text-[11px]">{customization.fgColor.toUpperCase()}</span>
              </div>
              <span className="text-on-surface-muted text-[10px]">ON</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: customization.bgColor }}
                  title="Background"
                />
                <span className="font-mono font-semibold text-[11px]">{customization.bgColor.toUpperCase()}</span>
              </div>
              <Badge variant="neutral" size="sm">
                Level {customization.errorCorrectionLevel}
              </Badge>
            </div>

            {/* Primary Save QR Code Action */}
            <div className="w-full pt-4 mt-2 border-t border-subdued">
              <Button
                variant={currentEditingId ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                disabled={!pngDataUrl || isLoading}
                leftIcon={saveSuccess ? <BookmarkCheck className="w-4 h-4 text-emerald-500" /> : <Bookmark className="w-4 h-4 text-primary-600" />}
                onClick={() => setIsSaveModalOpen(true)}
              >
                {saveSuccess
                  ? 'Saved to LocalStorage!'
                  : currentEditingId
                  ? 'Update Saved QR Code'
                  : 'Save QR Code to History'}
              </Button>
            </div>

            {/* Download Actions */}
            <div className="w-full flex flex-col gap-2.5 mt-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pngDataUrl || isLoading}
                  leftIcon={<Download className="w-4 h-4 text-primary-600" />}
                  onClick={handleDownloadPNG}
                >
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!svgString || isLoading}
                  leftIcon={<Download className="w-4 h-4 text-secondary-600" />}
                  onClick={handleDownloadSVG}
                >
                  Download SVG
                </Button>
              </div>

              {/* Copy and Share */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!rawPayload || isLoading}
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied Payload!' : 'Copy Payload'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pngDataUrl || isLoading}
                  leftIcon={shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                >
                  {shared ? 'Shared!' : 'Share QR'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Save QR Code Dialog Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title={currentEditingId ? 'Update Saved QR Code' : 'Save QR Code'}
        description="Save this custom code to your browser's private local storage for fast re-export and management."
      >
        <div className="flex flex-col gap-4">
          <Input
            label="QR Code Name / Label"
            placeholder="e.g. My Website, Guest Wi-Fi, Alex vCard"
            value={qrName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQrName(e.target.value)}
          />

          <div className="p-3 rounded-xl bg-surface-raised border border-subdued text-xs text-on-surface-muted flex items-center justify-between">
            <span>Type: {contentType.toUpperCase()}</span>
            <span>Dimensions: {customization.size}px</span>
            <span>Level: {customization.errorCorrectionLevel}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSaveQR}
            >
              {currentEditingId ? 'Update Record' : 'Confirm & Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

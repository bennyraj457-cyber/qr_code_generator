import React, { useState } from 'react';
import {
  Copy,
  ExternalLink,
  Share2,
  RefreshCw,
  Globe,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Contact,
  Type,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { isSafeUrl } from '../utils/resultParser';
import type { ScanResult } from '../types';

interface ScanResultCardProps {
  result: ScanResult;
  onScanAgain: () => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  result,
  onScanAgain,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scanned QR Code',
          text: result.rawText,
          url: isSafeUrl(result.rawText) ? result.rawText : undefined,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    handleCopy();
  };

  const getTypeIcon = () => {
    switch (result.type) {
      case 'url':
        return <Globe className="w-4 h-4 text-primary-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-secondary-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'vcard':
        return <Contact className="w-4 h-4 text-amber-600" />;
      case 'text':
      default:
        return <Type className="w-4 h-4 text-slate-600" />;
    }
  };

  const isUrl = isSafeUrl(result.rawText);

  return (
    <Card level={2} className="p-5 sm:p-6 flex flex-col gap-5 border border-primary-500/30 animate-in fade-in zoom-in-95 duration-200">
      {/* Result Header */}
      <div className="flex items-center justify-between border-b border-subdued pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <span className="flex items-center gap-1.5 capitalize font-bold">
              {getTypeIcon()}
              {result.type} Detected
            </span>
          </Badge>
          <span className="text-xs text-on-surface-muted font-mono">
            {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Decoded Locally
        </span>
      </div>

      {/* Structured Details if Wi-Fi or vCard */}
      {result.metadata?.details && (
        <div className="p-4 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-2 text-xs">
          <span className="font-bold text-on-surface text-sm">{result.metadata.title}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
            {Object.entries(result.metadata.details).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-on-surface-muted font-semibold">{key}:</span>
                <span className="text-on-surface font-bold truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Payload Preview */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-on-surface-muted">Decoded QR Content</span>
        <div className="p-3.5 rounded-xl bg-surface-raised border border-subdued font-mono text-xs text-on-surface break-all select-all max-h-48 overflow-y-auto">
          {result.rawText}
        </div>
      </div>

      {/* Actions Island */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {isUrl && (
            <a
              href={result.rawText}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Open Link Safely
              </Button>
            </a>
          )}

          <Button
            variant={isUrl ? 'secondary' : 'primary'}
            size="md"
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Result'}
          </Button>

          <Button
            variant="outline"
            size="md"
            leftIcon={shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            {shared ? 'Shared' : 'Share'}
          </Button>
        </div>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onScanAgain}
        >
          Scan Again
        </Button>
      </div>
    </Card>
  );
};


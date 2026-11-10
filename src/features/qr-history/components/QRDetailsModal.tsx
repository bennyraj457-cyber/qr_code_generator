import React, { useState } from 'react';
import {
  Download,
  Copy,
  Edit2,
  Layers,
  Palette,
  Shield,
  Check,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { downloadFile } from '../../qr-generator/utils/qrGenerator';
import type { SavedQRCode } from '../types';

interface QRDetailsModalProps {
  item: SavedQRCode | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: SavedQRCode) => void;
}

export const QRDetailsModal: React.FC<QRDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadPNG = () => {
    if (item.thumbnailUrl) {
      downloadFile(item.thumbnailUrl, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`, true);
    }
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      description={`Type: ${item.type.toUpperCase()} • Created ${formattedDate}`}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-6">
        {/* Large Preview Canvas */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-raised border border-subdued">
          <div
            className="w-56 h-56 rounded-xl flex items-center justify-center p-4 shadow-sm border border-subdued overflow-hidden"
            style={{ backgroundColor: item.bgColor }}
          >
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <span className="text-xs text-on-surface-muted">No thumbnail available</span>
            )}
          </div>
          <span className="text-[11px] font-mono text-on-surface-muted mt-2">
            Resolution: {item.size} × {item.size} px • Level {item.errorCorrectionLevel}
          </span>
        </div>

        {/* Content Payload Inspector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary-600" />
            Encoded QR Content (Payload)
          </span>
          <div className="p-3 bg-surface-raised rounded-xl border border-subdued font-mono text-xs text-on-surface break-all select-all">
            {item.content}
          </div>
        </div>

        {/* Customization Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-1">
            <span className="text-on-surface-muted flex items-center gap-1 text-[11px]">
              <Palette className="w-3 h-3 text-primary-600" /> Foreground
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: item.fgColor }}
              />
              <span className="font-mono font-bold">{item.fgColor}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-1">
            <span className="text-on-surface-muted flex items-center gap-1 text-[11px]">
              <Palette className="w-3 h-3 text-primary-600" /> Background
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: item.bgColor }}
              />
              <span className="font-mono font-bold">{item.bgColor}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-1">
            <span className="text-on-surface-muted flex items-center gap-1 text-[11px]">
              <Shield className="w-3 h-3 text-primary-600" /> Correction
            </span>
            <span className="font-bold">Level {item.errorCorrectionLevel}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-subdued flex flex-col gap-1">
            <span className="text-on-surface-muted flex items-center gap-1 text-[11px]">
              <Layers className="w-3 h-3 text-primary-600" /> Dot Matrix
            </span>
            <span className="font-bold capitalize">{item.dotType || 'Standard'}</span>
          </div>
        </div>

        {/* Actions Island */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-subdued">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied Content' : 'Copy Content'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4 text-primary-600" />}
              onClick={handleDownloadPNG}
            >
              Download PNG
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onEdit(item);
              }}
            >
              Edit in Studio
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

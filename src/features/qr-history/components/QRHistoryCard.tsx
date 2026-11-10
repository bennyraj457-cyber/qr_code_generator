import React, { useState } from 'react';
import {
  Download,
  Copy,
  Edit2,
  Trash2,
  Calendar,
  Globe,
  Wifi,
  Mail,
  Contact,
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Type,
  Check,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { IconButton } from '../../../components/ui/IconButton';
import { downloadFile } from '../../qr-generator/utils/qrGenerator';
import type { SavedQRCode } from '../types';

interface QRHistoryCardProps {
  item: SavedQRCode;
  viewMode: 'grid' | 'list';
  onView: (item: SavedQRCode) => void;
  onEdit: (item: SavedQRCode) => void;
  onDelete: (id: string) => void;
}

export const QRHistoryCard: React.FC<QRHistoryCardProps> = ({
  item,
  viewMode,
  onView,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.thumbnailUrl) {
      downloadFile(item.thumbnailUrl, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`, true);
    }
  };

  const getTypeIcon = (type: SavedQRCode['type']) => {
    switch (type) {
      case 'url':
        return <Globe className="w-3.5 h-3.5 text-primary-600" />;
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-secondary-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-emerald-600" />;
      case 'vcard':
        return <Contact className="w-3.5 h-3.5 text-amber-600" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-emerald-600" />;
      case 'text':
      default:
        return <Type className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (viewMode === 'list') {
    return (
      <Card
        level={1}
        interactive
        onClick={() => onView(item)}
        className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:border-strong transition-all"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Thumbnail */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center p-1 shrink-0 border border-subdued shadow-xs overflow-hidden"
            style={{ backgroundColor: item.bgColor }}
          >
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-surface-raised" />
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="neutral" size="sm">
                <span className="flex items-center gap-1 text-[10px]">
                  {getTypeIcon(item.type)}
                  {item.type}
                </span>
              </Badge>
              <span className="text-[11px] text-on-surface-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface truncate">{item.name}</h4>
            <p className="text-xs text-on-surface-muted font-mono truncate">{item.content}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Copy content"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Download PNG"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 text-primary-600" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Edit QR Code"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Edit2 className="w-4 h-4 text-secondary-600" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Delete QR Code"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-error" />
          </IconButton>
        </div>
      </Card>
    );
  }

  // Grid Mode Card
  return (
    <Card
      level={1}
      interactive
      onClick={() => onView(item)}
      className="p-5 flex flex-col justify-between gap-4 hover:border-strong transition-all"
    >
      <div className="flex items-start gap-4">
        {/* QR Thumbnail */}
        <div
          className="w-20 h-20 rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-subdued shadow-xs overflow-hidden"
          style={{ backgroundColor: item.bgColor }}
        >
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-surface-raised" />
          )}
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge variant="primary" size="sm">
              <span className="flex items-center gap-1 text-[10px]">
                {getTypeIcon(item.type)}
                {item.type}
              </span>
            </Badge>
          </div>

          <h3 className="text-sm font-bold text-on-surface truncate" title={item.name}>
            {item.name}
          </h3>

          <p className="text-xs text-on-surface-muted font-mono truncate mt-0.5" title={item.content}>
            {item.content}
          </p>

          <span className="text-[11px] text-on-surface-muted flex items-center gap-1 mt-2">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Card Action Island */}
      <div className="pt-3 border-t border-subdued flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="text-[11px] font-mono text-on-surface-muted">
          {item.size}px • Lvl {item.errorCorrectionLevel}
        </span>

        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Copy content"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Download PNG"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 text-primary-600" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Edit QR Code"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Edit2 className="w-4 h-4 text-secondary-600" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Delete QR Code"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-error" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};


import React from 'react';
import {
  Globe,
  Wifi,
  MessageCircle,
  Mail,
  Phone,
  MessageSquare,
  Contact,
  Camera,
  Share2,
  Video,
  MapPin,
  Type,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { QRTemplate } from '../types';

interface TemplateCardProps {
  template: QRTemplate;
  onUseTemplate: (template: QRTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUseTemplate,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-primary-600" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-secondary-600" />;
      case 'MessageCircle':
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-emerald-600" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-blue-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-indigo-600" />;
      case 'Contact':
        return <Contact className="w-5 h-5 text-amber-600" />;
      case 'Instagram':
        return <Camera className="w-5 h-5 text-rose-600" />;
      case 'Facebook':
        return <Share2 className="w-5 h-5 text-blue-600" />;
      case 'Youtube':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      case 'Type':
      default:
        return <Type className="w-5 h-5 text-slate-600" />;
    }
  };

  const fg = template.defaultColors?.fg || '#4F46E5';
  const bg = template.defaultColors?.bg || '#FFFFFF';

  return (
    <Card
      level={1}
      className="p-5 flex flex-col justify-between gap-5 hover:border-strong transition-all duration-200 group"
    >
      <div className="flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {getIcon(template.iconName)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface line-clamp-1">{template.name}</h3>
              <span className="text-[11px] font-semibold text-on-surface-muted">
                {template.category}
              </span>
            </div>
          </div>

          {template.badge && (
            <Badge variant="primary" size="sm">
              {template.badge}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-on-surface-muted leading-relaxed line-clamp-2">
          {template.description}
        </p>

        {/* Visual Mini Mockup Preview Tile */}
        <div
          className="w-full h-24 rounded-xl flex items-center justify-center p-3 border border-subdued/80 shadow-inner overflow-hidden relative"
          style={{ backgroundColor: bg }}
        >
          {/* Simulated QR matrix */}
          <div className="w-16 h-16 flex items-center justify-center" style={{ color: fg }}>
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <rect x="0" y="0" width="30" height="30" rx="6" />
              <rect x="6" y="6" width="18" height="18" rx="3" fill={bg} />
              <rect x="11" y="11" width="8" height="8" rx="2" />
              <rect x="70" y="0" width="30" height="30" rx="6" />
              <rect x="76" y="6" width="18" height="18" rx="3" fill={bg} />
              <rect x="81" y="11" width="8" height="8" rx="2" />
              <rect x="0" y="70" width="30" height="30" rx="6" />
              <rect x="6" y="76" width="18" height="18" rx="3" fill={bg} />
              <rect x="11" y="81" width="8" height="8" rx="2" />
              <rect x="40" y="15" width="8" height="8" rx="2" />
              <rect x="40" y="40" width="8" height="8" rx="2" />
              <rect x="60" y="40" width="8" height="8" rx="2" />
              <rect x="40" y="65" width="8" height="8" rx="2" />
              <rect x="60" y="65" width="8" height="8" rx="2" />
              <rect x="75" y="75" width="8" height="8" rx="2" />
            </svg>
          </div>

          <span
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs border border-black/5"
            style={{ backgroundColor: bg, color: fg }}
          >
            {template.qrType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Button Action */}
      <div className="pt-2 border-t border-subdued">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onUseTemplate(template)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Use Template
        </Button>
      </div>
    </Card>
  );
};

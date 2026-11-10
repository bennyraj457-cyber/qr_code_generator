import React, { useState } from 'react';
import {
  Sparkles,
  ScanLine,
  LayoutGrid,
  FolderArchive,
  ArrowRight,
  Globe,
  Wifi,
  Mail,
  Phone,
  Contact,
  MessageCircle,
  MapPin,
  Eye,
  Download,
  Edit2,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useQRHistory, type SavedQRCode } from '../features/qr-history';
import { QRDetailsModal } from '../features/qr-history/components/QRDetailsModal';
import { downloadFile } from '../features/qr-generator/utils/qrGenerator';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectType: (type: string) => void;
  onEditQRCode: (item: SavedQRCode) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectType,
  onEditQRCode,
}) => {
  const { items } = useQRHistory();
  const [viewingItem, setViewingItem] = useState<SavedQRCode | null>(null);

  // Latest 5 saved QR codes (real data from LocalStorage)
  const recentItems = items.slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url':
        return <Globe className="w-4 h-4 text-primary-600" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-secondary-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'vcard':
        return <Contact className="w-4 h-4 text-amber-600" />;
      default:
        return <Globe className="w-4 h-4 text-primary-600" />;
    }
  };

  const popularTypes = [
    { id: 'url', label: 'Website URL', icon: Globe, desc: 'Any link or webpage' },
    { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi, desc: 'Instant wireless scan' },
    { id: 'whatsapp', label: 'WhatsApp Chat', icon: MessageCircle, desc: 'One-tap messaging' },
    { id: 'vcard', label: 'Contact Card', icon: Contact, desc: 'Digital vCard 3.0' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white p-6 sm:p-10 shadow-level-2">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                Studio Workspace
              </span>
              <span className="text-xs text-indigo-200">v1.0 Local PWA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome to QR Studio
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Create, scan, customize, and manage precision vector QR codes. Fast, private, and 100% functional offline on this device.
            </p>
          </div>

          {/* Quick Primary Actions in Hero */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-white text-primary-700 hover:bg-slate-50 font-bold border-none shadow-md"
              leftIcon={<Sparkles className="w-5 h-5 text-primary-600" />}
              onClick={() => onNavigate('generator')}
            >
              Create QR Code
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
              leftIcon={<ScanLine className="w-5 h-5 text-white" />}
              onClick={() => onNavigate('scanner')}
            >
              Scan QR Code
            </Button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -top-16 w-48 h-48 rounded-full bg-indigo-400/10 pointer-events-none" />
      </div>

      {/* 2. Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card
          level={1}
          interactive
          onClick={() => onNavigate('generator')}
          className="p-5 flex flex-col gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">Generator</h3>
            <p className="text-xs text-on-surface-muted mt-0.5">Build custom barcodes</p>
          </div>
        </Card>

        <Card
          level={1}
          interactive
          onClick={() => onNavigate('scanner')}
          className="p-5 flex flex-col gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 text-secondary-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">Scan Codes</h3>
            <p className="text-xs text-on-surface-muted mt-0.5">Live camera & image file</p>
          </div>
        </Card>

        <Card
          level={1}
          interactive
          onClick={() => onNavigate('templates')}
          className="p-5 flex flex-col gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">Templates</h3>
            <p className="text-xs text-on-surface-muted mt-0.5">12 ready-made styles</p>
          </div>
        </Card>

        <Card
          level={1}
          interactive
          onClick={() => onNavigate('history')}
          className="p-5 flex flex-col gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-on-surface">My QR Codes</h3>
              <p className="text-xs text-on-surface-muted mt-0.5">Saved collection</p>
            </div>
            <span className="text-base font-extrabold font-mono text-primary-600">
              {items.length}
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Frequently Used Formats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface">Quick Format Launchers</h2>
            <p className="text-xs text-on-surface-muted mt-0.5">
              Jump straight into creating common QR codes with pre-set inputs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onSelectType(type.id)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-base border border-subdued hover:border-primary-500/50 hover:bg-surface-raised transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-raised group-hover:bg-primary-50 dark:group-hover:bg-primary-950/40 text-on-surface group-hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-on-surface block truncate">
                    {type.label}
                  </span>
                  <span className="text-[10px] text-on-surface-muted block truncate">
                    {type.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Recent QR Codes Section (Real LocalStorage Data) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-on-surface">Recently Created</h2>
            <Badge variant="primary" size="sm">
              {items.length} Total
            </Badge>
          </div>

          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('history')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card level={1} className="p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 bg-surface-base/50 border-dashed border-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">No QR Codes Created Yet</h3>
              <p className="text-xs text-on-surface-muted max-w-sm mt-1">
                Your recently generated QR codes will automatically appear here. Start by creating a website, Wi-Fi or contact card.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('generator')}
              className="mt-2"
            >
              Create Your First QR Code
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <Card
                key={item.id}
                level={1}
                interactive
                onClick={() => setViewingItem(item)}
                className="p-4 flex flex-col justify-between gap-3 hover:border-strong transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center p-1 shrink-0 border border-subdued overflow-hidden shadow-xs"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-surface-raised" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge variant="neutral" size="sm">
                        <span className="flex items-center gap-1 text-[10px]">
                          {getTypeIcon(item.type)}
                          {item.type}
                        </span>
                      </Badge>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-on-surface truncate" title={item.name}>
                      {item.name}
                    </h4>

                    <p className="text-[11px] text-on-surface-muted font-mono truncate mt-0.5">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div
                  className="pt-2.5 border-t border-subdued flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] text-on-surface-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="View Details"
                      onClick={() => setViewingItem(item)}
                      className="p-1 text-on-surface-muted hover:text-primary-600 rounded cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Download PNG"
                      onClick={() => {
                        if (item.thumbnailUrl) {
                          downloadFile(item.thumbnailUrl, `${item.name.toLowerCase().replace(/\s+/g, '-')}.png`, true);
                        }
                      }}
                      className="p-1 text-on-surface-muted hover:text-primary-600 rounded cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit QR Code"
                      onClick={() => onEditQRCode(item)}
                      className="p-1 text-on-surface-muted hover:text-secondary-600 rounded cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 5. Privacy Notice Footer Strip */}
      <div className="p-4 rounded-2xl bg-surface-base border border-subdued flex items-center gap-3 text-xs text-on-surface-muted">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong>100% Client-Side Privacy:</strong> All QR generation, customization, scan decoding, and history are stored locally in your browser sandbox. No telemetry or server uploads.
        </span>
      </div>

      {/* Details Modal */}
      <QRDetailsModal
        item={viewingItem}
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        onEdit={(it) => {
          setViewingItem(null);
          onEditQRCode(it);
        }}
      />
    </div>
  );
};

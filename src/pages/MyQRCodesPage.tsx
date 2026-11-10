import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  FolderArchive,
  DownloadCloud,
  UploadCloud,
  Trash2,
  Lock,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  Input,
  Button,
  Badge,
  EmptyState,
  Modal,
} from '../components/ui';
import { cn } from '../utils/cn';
import {
  useQRHistory,
  QRDetailsModal,
  QRHistoryCard,
  type SavedQRCode,
  type QRHistorySortOrder,
} from '../features/qr-history';

interface MyQRCodesPageProps {
  onNavigateToGenerator?: () => void;
  onEditQRCode?: (item: SavedQRCode) => void;
}

export const MyQRCodesPage: React.FC<MyQRCodesPageProps> = ({
  onNavigateToGenerator,
  onEditQRCode,
}) => {
  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    storageError,
    remove,
    clearAll,
    exportJSON,
    importJSON,
  } = useQRHistory();

  // Selected item for viewing in modal
  const [viewingItem, setViewingItem] = useState<SavedQRCode | null>(null);

  // Deletion confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState(false);

  // Import feedback
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const typeOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'url', label: 'Website' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'email', label: 'Email' },
    { id: 'vcard', label: 'Contact' },
    { id: 'phone', label: 'Phone' },
    { id: 'sms', label: 'SMS' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'location', label: 'Location' },
    { id: 'text', label: 'Text' },
  ];

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importJSON(content);
      if (res.success) {
        setImportStatus({
          success: true,
          message: `Successfully imported ${res.importedCount} QR code(s).`,
        });
      } else {
        setImportStatus({
          success: false,
          message: res.error || 'Failed to import backup.',
        });
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              My QR Codes
            </h1>
            <Badge variant="primary" size="md">
              {items.length} {items.length === 1 ? 'Code' : 'Codes'}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-on-surface-muted mt-1">
            Browse, manage, edit and export your saved local QR collection.
          </p>
        </div>

        {/* Global Toolbar: Import, Export, Create */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json,application/json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Import JSON
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={items.length === 0}
            onClick={exportJSON}
            leftIcon={<DownloadCloud className="w-4 h-4" />}
          >
            Export Backup
          </Button>

          {onNavigateToGenerator && (
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateToGenerator}
            >
              + Create New QR
            </Button>
          )}
        </div>
      </div>

      {/* Import / Storage Alert Notification */}
      {importStatus && (
        <div
          className={cn(
            'p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200',
            importStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-error/10 border-error/30 text-error'
          )}
        >
          {importStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      {storageError && (
        <div className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-2 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>{storageError}</span>
        </div>
      )}

      {/* 2. Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-xl bg-surface-raised border border-subdued flex items-center justify-between text-xs text-on-surface-muted">
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Your QR codes are stored locally on this device. QR Studio does not upload your saved QR data to a server.
          </span>
        </span>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setIsConfirmClearAllOpen(true)}
            className="text-error hover:underline font-semibold ml-4 shrink-0 cursor-pointer"
          >
            Clear All History
          </button>
        )}
      </div>

      {/* 3. Filter, Search & View Controls */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="w-full lg:max-w-md">
          <Input
            placeholder="Search by name or encoded content..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filters and View toggles */}
        <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
          {/* Type Filter Select */}
          <div className="flex items-center gap-1.5 text-xs text-on-surface-muted">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface-base border border-subdued rounded-lg px-2.5 py-1.5 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary-600"
            >
              {typeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Select */}
          <div className="flex items-center gap-1.5 text-xs text-on-surface-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as QRHistorySortOrder)}
              className="bg-surface-base border border-subdued rounded-lg px-2.5 py-1.5 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          {/* Grid / List view toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-subdued bg-surface-raised">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={cn(
                'p-1.5 rounded-md transition-colors cursor-pointer',
                viewMode === 'grid' ? 'bg-surface-base text-primary-600 shadow-xs' : 'text-on-surface-muted'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={cn(
                'p-1.5 rounded-md transition-colors cursor-pointer',
                viewMode === 'list' ? 'bg-surface-base text-primary-600 shadow-xs' : 'text-on-surface-muted'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Content Area: Grid / List / Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<FolderArchive className="w-8 h-8" />}
          title={searchQuery || typeFilter !== 'all' ? 'No matching QR codes found' : 'No QR codes yet'}
          description={
            searchQuery || typeFilter !== 'all'
              ? 'Try modifying your search query or reset the type filter.'
              : 'Create your first QR code using the studio generator. Your codes will be safely stored here.'
          }
          actionLabel="Create Your First QR Code"
          onAction={onNavigateToGenerator}
        />
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'flex flex-col gap-3'
          )}
        >
          {filteredItems.map((item: SavedQRCode) => (
            <QRHistoryCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onView={(it: SavedQRCode) => setViewingItem(it)}
              onEdit={(it: SavedQRCode) => onEditQRCode && onEditQRCode(it)}
              onDelete={(id: string) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* 5. Detailed Inspection Modal */}
      <QRDetailsModal
        item={viewingItem}
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        onEdit={(it: SavedQRCode) => onEditQRCode && onEditQRCode(it)}
      />

      {/* 6. Single Item Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete QR Code"
        description="Are you sure you want to delete this saved QR code? This action cannot be undone."
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (deleteId) {
                remove(deleteId);
                setDeleteId(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* 7. Clear All History Confirmation Modal */}
      <Modal
        isOpen={isConfirmClearAllOpen}
        onClose={() => setIsConfirmClearAllOpen(false)}
        title="Clear All QR History"
        description="This will permanently delete all saved QR codes from your browser storage. Make sure to export a backup if you wish to keep them."
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => setIsConfirmClearAllOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              clearAll();
              setIsConfirmClearAllOpen(false);
            }}
          >
            Permanently Clear All
          </Button>
        </div>
      </Modal>
    </div>
  );
};

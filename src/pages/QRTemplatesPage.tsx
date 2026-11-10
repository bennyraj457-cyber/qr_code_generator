import React, { useState } from 'react';
import { Search, LayoutGrid } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { cn } from '../utils/cn';
import {
  QR_TEMPLATES,
  TemplateCard,
  type QRTemplate,
  type TemplateCategory,
} from '../features/qr-templates';

interface QRTemplatesPageProps {
  onSelectTemplate: (template: QRTemplate) => void;
}

export const QRTemplatesPage: React.FC<QRTemplatesPageProps> = ({
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('All');

  const categories: TemplateCategory[] = [
    'All',
    'Web & Links',
    'Connectivity',
    'Communication',
    'Social Media',
    'Contact & Info',
  ];

  const filteredTemplates = QR_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.qrType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || tpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-1.5 text-left">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
            QR Code Templates
          </h1>
          <Badge variant="primary" size="md">
            12 Ready-Made
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-on-surface-muted max-w-2xl">
          Choose a pre-configured template, customize the information and styling, and generate a
          ready-to-scan QR code in seconds.
        </p>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search templates (e.g. Wi-Fi, Instagram, vCard)..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer min-h-[38px]',
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-xs font-bold'
                  : 'bg-surface-base text-on-surface-variant hover:bg-surface-raised border border-subdued'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Templates Grid / Empty State */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid className="w-8 h-8" />}
          title="No templates found"
          description={`We couldn't find any templates matching "${searchQuery}". Try a different keyword or category.`}
          actionLabel="View All Templates"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={onSelectTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

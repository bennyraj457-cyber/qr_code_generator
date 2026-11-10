import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'segmented' | 'underline';
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  fullWidth = false,
}) => {
  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={cn(
          'inline-flex p-1 bg-surface-raised border border-subdued rounded-xl select-none',
          fullWidth ? 'w-full' : 'w-auto'
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 min-h-[38px] cursor-pointer',
                fullWidth ? 'flex-1' : '',
                isActive
                  ? 'bg-surface-base text-primary-600 shadow-level-1 font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5 dark:hover:bg-white/5'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-primary-50 text-primary-600 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className="flex border-b border-subdued overflow-x-auto no-scrollbar scroll-smooth gap-4"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-3 pt-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap min-h-[44px] cursor-pointer',
              isActive
                ? 'border-primary-600 text-primary-600 font-bold'
                : 'border-transparent text-on-surface-muted hover:text-on-surface hover:border-strong'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-surface-raised text-on-surface-variant">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};


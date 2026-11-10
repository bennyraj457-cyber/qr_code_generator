import React from 'react';
import { LayoutDashboard, Sparkles, LayoutGrid, ScanLine, FolderArchive } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileNavBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ currentPage, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'generator', label: 'Generator', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'templates', label: 'Templates', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'scanner', label: 'Scanner', icon: <ScanLine className="w-5 h-5" /> },
    { id: 'history', label: 'My Codes', icon: <FolderArchive className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-base/90 backdrop-blur-lg border-t border-subdued px-1 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-level-2"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 min-h-[48px] min-w-[48px]',
                isActive
                  ? 'text-primary-600 font-bold scale-105'
                  : 'text-on-surface-muted hover:text-on-surface'
              )}
            >
              <div
                className={cn(
                  'p-1 rounded-full transition-colors',
                  isActive ? 'bg-primary-50 dark:bg-primary-950/50' : 'bg-transparent'
                )}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import {
  QrCode,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  LayoutGrid,
  ScanLine,
  FolderArchive,
  Settings,
  Info,
  DownloadCloud,
  Check,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InstallModal } from '../common/InstallModal';
import { cn } from '../../utils/cn';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'generator', label: 'Generator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'scanner', label: 'Scanner', icon: <ScanLine className="w-4 h-4" /> },
    { id: 'history', label: 'My Codes', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome === 'manual') {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-subdued bg-surface-base/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand / Logo -> navigates to Dashboard */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('dashboard')}
            aria-label="QR Studio home"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-on-surface">
                QR Studio
              </span>
              <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                PWA
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[44px]',
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-raised'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium screen Navigation Links (Compact) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navLinks.slice(0, 5).map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[40px]',
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-raised'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action icons, Settings, Theme & Install */}
          <div className="flex items-center gap-2">
            {!isInstalled && (
              <div className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<DownloadCloud className="w-4 h-4 text-primary-600" />}
                  onClick={handleInstallClick}
                >
                  Install App
                </Button>
              </div>
            )}

            {isInstalled && (
              <div className="hidden sm:block">
                <Badge variant="success" size="sm">
                  <Check className="w-3 h-3" /> Installed
                </Badge>
              </div>
            )}

            {/* Quick Settings Icon */}
            <IconButton
              variant="ghost"
              size="md"
              aria-label="App Settings"
              onClick={() => handleNavClick('settings')}
              className={currentPage === 'settings' ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/40' : ''}
            >
              <Settings className="w-5 h-5 text-on-surface-variant hover:text-on-surface" />
            </IconButton>

            {/* Theme Switcher Button */}
            <IconButton
              variant="ghost"
              size="md"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </IconButton>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <IconButton
                variant="ghost"
                size="md"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-subdued bg-surface-base px-4 py-3 animate-in slide-in-from-top duration-200 shadow-level-2">
            <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation Drawer">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-left transition-colors min-h-[48px]',
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 font-bold'
                        : 'text-on-surface-variant hover:bg-surface-raised hover:text-on-surface'
                    )}
                  >
                    <span className="p-1.5 rounded-lg bg-surface-raised text-on-surface">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {!isInstalled && (
                <div className="pt-2 border-t border-subdued mt-1">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    leftIcon={<DownloadCloud className="w-4 h-4" />}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleInstallClick();
                    }}
                  >
                    Install QR Studio App
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* PWA Installation Instructions Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onPromptInstall={promptInstall}
      />
    </>
  );
};

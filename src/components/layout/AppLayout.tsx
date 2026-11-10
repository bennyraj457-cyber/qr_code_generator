import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavBar } from './MobileNavBar';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { UpdateNotification } from '../common/UpdateNotification';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAppUpdate } from '../../hooks/useAppUpdate';

export interface AppLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  const isOnline = useOnlineStatus();
  const { needRefresh, updateApp, dismissUpdate } = useAppUpdate();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-on-surface antialiased transition-colors">
      <OfflineIndicator isOnline={isOnline} />
      <Header currentPage={currentPage} onNavigate={onNavigate} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-0">
        {children}
      </main>

      <Footer />
      <MobileNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <UpdateNotification
        isOpen={needRefresh}
        onUpdate={updateApp}
        onDismiss={dismissUpdate}
      />
    </div>
  );
};

import { useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { AppLayout } from './components/layout';
import {
  DashboardPage,
  QRGeneratorPage,
  QRTemplatesPage,
  MyQRCodesPage,
  QRScannerPage,
  SettingsPage,
  AboutPage,
} from './pages';
import type { SavedQRCode } from './features/qr-history';
import type { QRTemplate } from './features/qr-templates';

export function App() {
  // Main landing page is Dashboard
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [editingQRCode, setEditingQRCode] = useState<SavedQRCode | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(null);

  const [initialType, setInitialType] = useState<string | null>(null);

  const handleEditQRCode = (item: SavedQRCode) => {
    setSelectedTemplate(null);
    setInitialType(null);
    setEditingQRCode(item);
    setCurrentPage('generator');
  };

  const handleSelectTemplate = (template: QRTemplate) => {
    setEditingQRCode(null);
    setInitialType(null);
    setSelectedTemplate(template);
    setCurrentPage('generator');
  };

  const handleQuickSelectType = (type: string) => {
    setEditingQRCode(null);
    setSelectedTemplate(null);
    setInitialType(type);
    setCurrentPage('generator');
  };

  const handleClearEditing = () => {
    setEditingQRCode(null);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
  };

  return (
    <ThemeProvider>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={setCurrentPage}
            onSelectType={handleQuickSelectType}
            onEditQRCode={handleEditQRCode}
          />
        )}
        {currentPage === 'generator' && (
          <QRGeneratorPage
            editingItem={editingQRCode}
            selectedTemplate={selectedTemplate}
            initialContentType={initialType as any}
            onClearEditing={handleClearEditing}
            onClearTemplate={handleClearTemplate}
            onNavigateToHistory={() => setCurrentPage('history')}
          />
        )}
        {currentPage === 'templates' && (
          <QRTemplatesPage onSelectTemplate={handleSelectTemplate} />
        )}
        {currentPage === 'scanner' && <QRScannerPage />}
        {currentPage === 'history' && (
          <MyQRCodesPage
            onNavigateToGenerator={() => {
              setEditingQRCode(null);
              setSelectedTemplate(null);
              setCurrentPage('generator');
            }}
            onEditQRCode={handleEditQRCode}
          />
        )}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'about' && (
          <AboutPage onNavigateToGenerator={() => setCurrentPage('generator')} />
        )}
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;

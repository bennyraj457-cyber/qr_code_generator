import React, { useState } from 'react';
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Upload,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { cn } from '../utils/cn';
import {
  useQRScanner,
  ScanResultCard,
  ImageScannerUpload,
  type ScanResult,
} from '../features/qr-scanner';

export const QRScannerPage: React.FC = () => {
  const {
    videoRef,
    isScanning,
    scanResult,
    setScanResult,
    cameraError,
    errorMessage,
    availableDevices,
    selectedDeviceId,
    hasTorch,
    isTorchOn,
    startScanning,
    stopScanning,
    toggleTorch,
    switchCamera,
    resetScan,
  } = useQRScanner();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  const handleManualScanStart = () => {
    setActiveTab('camera');
    startScanning();
  };

  const handleImageResult = (result: ScanResult) => {
    stopScanning();
    setScanResult(result);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
              QR Code Scanner
            </h1>
            <Badge variant="primary" size="sm">
              Local Browser Engine
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-on-surface-muted mt-1">
            Scan QR codes instantly using your device camera or upload image files.
          </p>
        </div>

        {/* Tab switch between Live Camera & File Upload */}
        <div className="inline-flex p-1 bg-surface-raised border border-subdued rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!isScanning && !scanResult) {
                startScanning();
              }
            }}
            className={cn(
              'px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'camera'
                ? 'bg-surface-base text-primary-600 shadow-xs font-bold'
                : 'text-on-surface-muted hover:text-on-surface'
            )}
          >
            <Camera className="w-4 h-4" />
            Live Camera
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopScanning();
            }}
            className={cn(
              'px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2',
              activeTab === 'upload'
                ? 'bg-surface-base text-primary-600 shadow-xs font-bold'
                : 'text-on-surface-muted hover:text-on-surface'
            )}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
        </div>
      </div>

      {/* 2. Privacy & Offline Banner */}
      <div className="p-3.5 rounded-xl bg-surface-raised border border-subdued flex items-center justify-between text-xs text-on-surface-muted">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            100% Client-Side Privacy: Camera footage and images are decoded directly inside your device memory. Zero external server uploads.
          </span>
        </span>
      </div>

      {/* 3. Scan Result Display (Appears prominently when code is detected) */}
      {scanResult && (
        <ScanResultCard
          result={scanResult}
          onScanAgain={() => {
            if (activeTab === 'camera') {
              resetScan();
            } else {
              setScanResult(null);
            }
          }}
        />
      )}

      {/* 4. Tab A: Live Camera Scanner */}
      {activeTab === 'camera' && !scanResult && (
        <Card level={2} className="p-5 sm:p-6 flex flex-col items-center gap-5 overflow-hidden">
          {/* Camera Viewport Container */}
          <div className="relative w-full max-w-md aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-level-2 flex items-center justify-center border-2 border-primary-600/40">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanning Laser & Corner Overlay when active */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                {/* Visual Viewfinder Frame */}
                <div className="relative w-full h-full max-w-[260px] max-h-[260px] border-2 border-white/50 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Four Corner Accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />

                  {/* Animated laser scan line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent shadow-[0_0_8px_#4F46E5] animate-pulse" />
                </div>
              </div>
            )}

            {/* Overlay when camera stopped / error */}
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-white gap-3 z-10">
                {cameraError ? (
                  <>
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                    <p className="text-sm font-semibold text-rose-200 max-w-xs">{errorMessage}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleManualScanStart}
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                    >
                      Retry Camera Access
                    </Button>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-primary-400 opacity-80" />
                    <p className="text-sm font-semibold">Camera is stopped</p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Tap Start Camera Scanner to scan barcodes in real-time.
                    </p>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleManualScanStart}
                      leftIcon={<Camera className="w-4 h-4" />}
                    >
                      Start Camera Scanner
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Scanner Controls Island */}
          <div className="w-full max-w-md flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {isScanning ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={stopScanning}
                  leftIcon={<CameraOff className="w-4 h-4 text-error" />}
                >
                  Stop Scanning
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleManualScanStart}
                  leftIcon={<Camera className="w-4 h-4" />}
                >
                  Start Scanning
                </Button>
              )}

              {/* Torch button (only rendered if supported by device) */}
              {hasTorch && isScanning && (
                <Button
                  variant={isTorchOn ? 'primary' : 'outline'}
                  size="md"
                  onClick={toggleTorch}
                  leftIcon={isTorchOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
                >
                  {isTorchOn ? 'Torch On' : 'Torch Off'}
                </Button>
              )}
            </div>

            {/* Switch Camera selector (if multiple cameras available) */}
            {availableDevices.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-muted">
                <select
                  value={selectedDeviceId || ''}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="bg-surface-base border border-subdued rounded-xl px-2.5 py-2 text-xs text-on-surface font-semibold focus:outline-none focus:border-primary-600 max-w-[180px] truncate"
                >
                  {availableDevices.map((dev) => (
                    <option key={dev.deviceId} value={dev.deviceId}>
                      {dev.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <p className="text-xs text-on-surface-muted text-center max-w-sm">
            Point your camera steadily at any QR code. Detection happens automatically.
          </p>
        </Card>
      )}

      {/* 5. Tab B: Upload Image Scanner */}
      {activeTab === 'upload' && !scanResult && (
        <Card level={1} className="p-5 sm:p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">Scan from File</h3>
            <p className="text-xs text-on-surface-muted mt-0.5">
              Select or drop an image containing a QR code from your photo library or disk.
            </p>
          </div>

          <ImageScannerUpload onScanComplete={handleImageResult} />
        </Card>
      )}
    </div>
  );
};

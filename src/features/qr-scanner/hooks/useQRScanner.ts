import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { parseScanResult } from '../utils/resultParser';
import type { ScanResult, CameraErrorType, CameraDevice } from '../types';

export function useQRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<CameraErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);

  // Stop current active stream
  const stopScanning = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {
        // ignore
      }
      controlsRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setIsTorchOn(false);
  }, []);

  // Check and list available video input devices
  const listCameras = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    try {
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const mapped = devices.map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${index + 1}`,
      }));
      setAvailableDevices(mapped);

      // Default to back/rear camera if not already set
      if (!selectedDeviceId && mapped.length > 0) {
        const rear = mapped.find((c) => /back|rear|environment/i.test(c.label));
        setSelectedDeviceId(rear ? rear.deviceId : mapped[0].deviceId);
      }
      return mapped;
    } catch {
      return [];
    }
  }, [selectedDeviceId]);

  // Start live camera stream and QR detection
  const startScanning = useCallback(async () => {
    stopScanning();
    setCameraError(null);
    setErrorMessage(null);
    setScanResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('UNSUPPORTED');
      setErrorMessage('Camera access is not supported by your current browser.');
      return;
    }

    try {
      const reader = new BrowserQRCodeReader();

      // Video constraints: prefer environment/back camera if deviceId is not specified
      const constraints: MediaStreamConstraints = selectedDeviceId
        ? { video: { deviceId: { exact: selectedDeviceId } } }
        : { video: { facingMode: { ideal: 'environment' } } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Inspect torch capabilities
      const track = stream.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === 'function') {
        const caps = track.getCapabilities() as { torch?: boolean };
        setHasTorch(Boolean(caps.torch));
      } else {
        setHasTorch(false);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const controls = await reader.decodeFromStream(
          stream,
          videoRef.current,
          (result) => {
            if (result) {
              const parsed = parseScanResult(result.getText());
              setScanResult(parsed);
              stopScanning(); // Pause scanning automatically on detection
            }
          }
        );

        controlsRef.current = controls;
        setIsScanning(true);
      }

      // Refresh camera labels after permission has been granted
      listCameras();
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('PERMISSION_DENIED');
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings to scan QR codes.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('NOT_FOUND');
        setErrorMessage('No camera found on this device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('IN_USE');
        setErrorMessage('Camera is currently in use by another application.');
      } else {
        setCameraError('UNKNOWN');
        setErrorMessage('Unable to connect to camera. Please make sure camera permissions are enabled.');
      }
      setIsScanning(false);
    }
  }, [selectedDeviceId, stopScanning, listCameras]);

  // Toggle torch/flashlight
  const toggleTorch = useCallback(async () => {
    if (!videoRef.current?.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        const next = !isTorchOn;
        await track.applyConstraints({
          advanced: [{ torch: next } as any],
        });
        setIsTorchOn(next);
      } catch {
        // torch not supported on this track
      }
    }
  }, [hasTorch, isTorchOn]);

  // Switch between cameras
  const switchCamera = useCallback(
    (deviceId: string) => {
      setSelectedDeviceId(deviceId);
    },
    []
  );

  // Clean up when unmounting
  useEffect(() => {
    listCameras();
    return () => {
      stopScanning();
    };
  }, [listCameras, stopScanning]);

  // If selected camera changes while scanning, restart
  useEffect(() => {
    if (isScanning && selectedDeviceId) {
      startScanning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  const resetScan = useCallback(() => {
    setScanResult(null);
    startScanning();
  }, [startScanning]);

  return {
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
  };
}

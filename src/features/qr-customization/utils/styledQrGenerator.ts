import QRCodeStyling from 'qr-code-styling';
import type { QRCustomizationState } from '../types';

let stylingInstance: QRCodeStyling | null = null;

function getStylingInstance(): QRCodeStyling {
  if (!stylingInstance) {
    stylingInstance = new QRCodeStyling({
      width: 512,
      height: 512,
      type: 'canvas',
      data: 'https://qrstudio.app',
      margin: 16,
    });
  }
  return stylingInstance;
}

/**
 * Builds the qr-code-styling options object from our customization state and payload.
 */
export function buildStylingOptions(content: string, state: QRCustomizationState) {
  // Safe logo sizing: keep logo within 20% - 28% of QR code width to ensure scannability
  const imageMargin = 6;
  const errorCorrectionLevel = state.logoDataUrl ? 'H' : state.errorCorrectionLevel;

  return {
    width: state.size,
    height: state.size,
    type: 'canvas' as const,
    data: content || 'https://qrstudio.app',
    margin: 16, // Enforces 4-module quiet zone
    qrOptions: {
      typeNumber: 0 as const,
      mode: 'Byte' as const,
      errorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: state.logoSizePercent || 0.26,
      margin: imageMargin,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      type: state.dotType,
      color: state.fgColor,
    },
    backgroundOptions: {
      color: state.bgColor,
    },
    cornersSquareOptions: {
      type: state.cornerSquareType,
      color: state.fgColor,
    },
    cornersDotOptions: {
      type: state.cornerDotType,
      color: state.fgColor,
    },
    image: state.logoDataUrl || undefined,
  };
}

/**
 * Generates both PNG Data URL and SVG string with styling, shapes, and logo included.
 */
export async function generateStyledQRCode(
  content: string,
  state: QRCustomizationState
): Promise<{ pngDataUrl: string; svgString: string }> {
  const instance = getStylingInstance();
  const options = buildStylingOptions(content, state);

  instance.update(options);

  // 1. Get PNG Blob -> Data URL
  const rawPngBlob = await instance.getRawData('png');
  let pngDataUrl = '';
  if (rawPngBlob) {
    pngDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(rawPngBlob as Blob);
    });
  }

  // 2. Get SVG Blob -> SVG String
  const rawSvgBlob = await instance.getRawData('svg');
  let svgString = '';
  if (rawSvgBlob) {
    svgString = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(rawSvgBlob as Blob);
    });
  }

  return {
    pngDataUrl,
    svgString,
  };
}

import React from 'react';
import {
  Palette,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Sliders,
  Check,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, Button, Input, ColorPicker, Badge } from '../../../components/ui';
import { cn } from '../../../utils/cn';
import { COLOR_PRESETS, checkContrast } from '../utils/colorPresets';
import { LogoUploader } from './LogoUploader';
import type {
  QRCustomizationState,
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
} from '../types';

interface CustomizationPanelProps {
  customization: QRCustomizationState;
  isCustomSize: boolean;
  onSetIsCustomSize: (val: boolean) => void;
  onSetFgColor: (color: string) => void;
  onSetBgColor: (color: string) => void;
  onApplyPreset: (id: string) => void;
  onResetColors: () => void;
  onSetSize: (size: number) => void;
  onSetErrorCorrection: (lvl: ErrorCorrectionLevel) => void;
  onSetDotType: (type: DotType) => void;
  onSetCornerSquareType: (type: CornerSquareType) => void;
  onSetCornerDotType: (type: CornerDotType) => void;
  onSetLogo: (dataUrl: string | null, fileName: string | null) => void;
  onResetAll: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  isCustomSize,
  onSetIsCustomSize,
  onSetFgColor,
  onSetBgColor,
  onApplyPreset,
  onResetColors,
  onSetSize,
  onSetErrorCorrection,
  onSetDotType,
  onSetCornerSquareType,
  onSetCornerDotType,
  onSetLogo,
  onResetAll,
}) => {
  const contrastResult = checkContrast(customization.fgColor, customization.bgColor);

  const dotStyles: { id: DotType; label: string; desc: string }[] = [
    { id: 'square', label: 'Standard', desc: 'Square blocks' },
    { id: 'rounded', label: 'Rounded', desc: 'Smooth edges' },
    { id: 'dots', label: 'Circular', desc: 'Dot matrix' },
    { id: 'classy', label: 'Classy', desc: 'Beveled corners' },
  ];

  const cornerSquareStyles: { id: CornerSquareType; label: string }[] = [
    { id: 'square', label: 'Sharp' },
    { id: 'extra-rounded', label: 'Curved' },
    { id: 'dot', label: 'Circle' },
  ];

  const standardSizes = [
    { label: 'Small (256px)', value: 256 },
    { label: 'Medium (512px)', value: 512 },
    { label: 'Large (1024px)', value: 1024 },
  ];

  const errorLevels: { level: ErrorCorrectionLevel; name: string; percent: string; desc: string }[] = [
    { level: 'L', name: 'Low', percent: '7%', desc: 'Best for crisp clean displays with minimal damage risk' },
    { level: 'M', name: 'Medium', percent: '15%', desc: 'Default balance of data density and durability' },
    { level: 'Q', name: 'Quartile', percent: '25%', desc: 'Recommended for industrial and outdoor signage' },
    { level: 'H', name: 'High', percent: '30%', desc: 'Required when adding a center logo or badge' },
  ];

  return (
    <Card level={1} className="p-4 sm:p-6 flex flex-col gap-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-subdued pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary-600" />
          <h3 className="text-sm sm:text-base font-bold text-on-surface">
            QR Styling & Customization
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetAll}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Reset All
        </Button>
      </div>

      {/* 1. Preset Themes */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Accessible Color Themes</span>
          </label>
          <span className="text-[11px] text-on-surface-muted">Contrast verified</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              customization.fgColor.toLowerCase() === preset.fgColor.toLowerCase() &&
              customization.bgColor.toLowerCase() === preset.bgColor.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={cn(
                  'flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer min-h-[44px]',
                  isSelected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 shadow-xs'
                    : 'border-subdued bg-surface-base hover:bg-surface-raised'
                )}
              >
                <div
                  className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: preset.bgColor }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: preset.fgColor }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{preset.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Colors & Hex Inputs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary-600" />
            <span>Custom Colors & Hex Codes</span>
          </label>
          <button
            type="button"
            onClick={onResetColors}
            className="text-[11px] font-semibold text-primary-600 hover:underline cursor-pointer"
          >
            Reset Colors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker
            label="Matrix Foreground Color"
            value={customization.fgColor}
            onChange={onSetFgColor}
          />

          <ColorPicker
            label="Canvas Background Color"
            value={customization.bgColor}
            onChange={onSetBgColor}
          />
        </div>

        {/* Contrast Warning or Confirmation */}
        {contrastResult.warning ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-start gap-2 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Contrast Ratio: {contrastResult.ratio}:1 — </span>
              <span>{contrastResult.warning}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-1">
            <Check className="w-3.5 h-3.5" />
            <span>Excellent Contrast Ratio ({contrastResult.ratio}:1) - High Scannability</span>
          </div>
        )}
      </div>

      {/* 3. Module & Corner Shape Styling */}
      <div className="flex flex-col gap-3 border-t border-subdued pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary-600" />
            <span>Matrix & Corner Module Styling</span>
          </label>
          <Badge variant="neutral" size="sm">
            SVG Vector Engine
          </Badge>
        </div>

        {/* Dot Styles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dotStyles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSetDotType(item.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer min-h-[58px]',
                customization.dotType === item.id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold shadow-xs'
                  : 'border-subdued bg-surface-base text-on-surface hover:bg-surface-raised'
              )}
            >
              <span className="text-xs font-bold leading-tight">{item.label}</span>
              <span className="text-[10px] text-on-surface-muted mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* Eye/Corner Square Styles */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-xs font-semibold text-on-surface-muted">
            Corner Eyes (Position Detectors)
          </span>
          <div className="grid grid-cols-3 gap-2">
            {cornerSquareStyles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  onSetCornerSquareType(style.id);
                  onSetCornerDotType(style.id === 'dot' ? 'dot' : 'square');
                }}
                className={cn(
                  'py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center',
                  customization.cornerSquareType === style.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold'
                    : 'border-subdued bg-surface-base text-on-surface hover:bg-surface-raised'
                )}
              >
                {style.label} Frame
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Logo Upload Center Area */}
      <div className="border-t border-subdued pt-4">
        <LogoUploader
          logoDataUrl={customization.logoDataUrl}
          logoFileName={customization.logoFileName}
          onLogoChange={onSetLogo}
        />
      </div>

      {/* 5. QR Size Controls */}
      <div className="flex flex-col gap-3 border-t border-subdued pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600" />
            <span>QR Dimension & Resolution</span>
          </label>
          <span className="text-xs font-mono font-bold text-primary-600">
            {customization.size} × {customization.size} px
          </span>
        </div>

        {/* Standard Size Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {standardSizes.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                onSetSize(s.value);
                onSetIsCustomSize(false);
              }}
              className={cn(
                'py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer min-h-[40px]',
                !isCustomSize && customization.size === s.value
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold'
                  : 'border-subdued bg-surface-base text-on-surface hover:bg-surface-raised'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Custom Size Toggle & Slider */}
        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer select-none mb-2">
            <input
              type="checkbox"
              checked={isCustomSize}
              onChange={(e) => onSetIsCustomSize(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <span>Custom Dimension (128px – 2048px)</span>
          </label>

          {isCustomSize && (
            <div className="flex items-center gap-3 animate-in fade-in duration-150">
              <input
                type="range"
                min="128"
                max="2048"
                step="64"
                value={customization.size}
                onChange={(e) => onSetSize(parseInt(e.target.value, 10))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <Input
                type="number"
                min="128"
                max="2048"
                value={customization.size}
                onChange={(e) => onSetSize(parseInt(e.target.value, 10) || 512)}
                className="w-24 text-center font-mono text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* 6. Error Correction Controls with Explanations */}
      <div className="flex flex-col gap-3 border-t border-subdued pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary-600" />
            <span>Error Correction (Reed-Solomon Level)</span>
          </label>
          {customization.logoDataUrl && (
            <Badge variant="primary" size="sm">
              Locked to High (H) for Logo
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {errorLevels.map((lvl) => {
            const isSelected = customization.errorCorrectionLevel === lvl.level;
            const isDisabled = Boolean(customization.logoDataUrl) && lvl.level !== 'H';

            return (
              <button
                key={lvl.level}
                type="button"
                disabled={isDisabled}
                onClick={() => onSetErrorCorrection(lvl.level)}
                className={cn(
                  'flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[64px]',
                  isDisabled && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold'
                    : 'border-subdued bg-surface-base text-on-surface hover:bg-surface-raised'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">
                    Level {lvl.level} ({lvl.name})
                  </span>
                  <span className="text-[11px] font-mono opacity-80">{lvl.percent} Recovery</span>
                </div>
                <p className="text-[11px] font-normal text-on-surface-muted mt-1 leading-tight">
                  {lvl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

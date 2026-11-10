---
name: QR Studio Modern PWA
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a high-utility, modern SaaS aesthetic engineered specifically for precision generative tools. It balances utilitarian clarity with vivid, digital-native energy.

### Aesthetic Principles
- **Functional Polish:** Every element serves clarity and operational speed. Interfaces feel surgical, crisp, and responsive.
- **Luminous Depth:** Clean, bright surfaces in light mode transition into deep obsidian layers in dark mode, offset by energetic electric violet accents.
- **Tactile Softness:** Subtly rounded geometry avoids visual fatigue, creating a friendly, modern SaaS workspace rather than an austere technical utility.
- **Studio Precision:** Special emphasis is placed on framing, high-contrast matrix elements, quiet zones, and real-time generation feedback loops.

## Colors

The palette relies on a vibrant indigo core paired with a precise cyan secondary tone. Dark mode is anchored by neutral obsidians rather than pure pitch black, preventing severe optical contrast while preserving depth.

### Palette Architecture

#### Primary (Electric Indigo)
- `primary-50`: `#EEF2FF`
- `primary-100`: `#E0E7FF`
- `primary-500`: `#6366F1`
- `primary-600` (Base Brand): `#4F46E5`
- `primary-700` (Hover): `#4338CA`
- `primary-800` (Active/Pressed): `#3730A3`

#### Secondary (Slate Cyan)
- `secondary-50`: `#F0F9FF`
- `secondary-500` (Accent): `#0EA5E9`
- `secondary-600`: `#0284C7`

#### Surface & Background Tokens
- **Light Theme:**
  - Canvas: `#F8FAFC`
  - Surface Default: `#FFFFFF`
  - Surface Raised / Hover: `#F1F5F9`
  - Border Subdued: `#E2E8F0`
  - Border Strong: `#CBD5E1`
- **Dark Theme:**
  - Canvas: `#0B0F19`
  - Surface Base: `#111827`
  - Surface Elevated: `#1E293B`
  - Border Subdued: `#1F2937`
  - Border Strong: `#334155`

#### Semantic Status
- **Success:** `#10B981` (Base), `#ECFDF5` (Soft Container)
- **Warning:** `#F59E0B` (Base), `#FFFBEB` (Soft Container)
- **Error:** `#F43F5E` (Base), `#FFF1F2` (Soft Container)
- **Info:** `#0284C7` (Base), `#F0F9FF` (Soft Container)

## Typography

Plus Jakarta Sans brings a contemporary, geometric balance that remains clean and legible at compact UI scales. 

### Typographic Hierarchy
- **Display & Headlines:** Tightly tracked headings create an intentional, editorial tech appearance. Use `display-lg` exclusively for main application hero banners or core studio onboarding headers.
- **Labels & Forms:** Labels use `font-weight: 600` for clear visual scanning across complex forms with dense options (e.g., error correction levels, margin sizing, dot-matrix shape pickers).
- **Monospace Elements:** Use `code-sm` (`JetBrains Mono`) for payload summaries, hex inputs, and raw URL/payload inspector views.

## Layout & Spacing

The workspace uses a dynamic dual-pane split on desktop and a stacked sheet paradigm on mobile, built on a strict 4px/8px modular rhythm.

### Grid & Breakpoints
- **Desktop (>= 1024px):** Fixed-fluid studio split. Left side hosts configuration panels (accordion or tabbed controls) with a max width of 520px; right side is a sticky visual preview canvas centered within remaining space.
- **Tablet (768px - 1023px):** Single-column stacked workflow or collapsible side drawer with 24px gutters.
- **Mobile (< 768px):** Single-column stream with bottom sheet preview anchor. 16px lateral canvas margins, 12px gutters.

### Studio Alignment Rules
- Parameter modules (Color, Shape, Logo upload, Precision slider) use `space-md` (16px) internal padding and stack with `space-sm` (8px) inter-component gaps.
- Sticky action bars maintain a 16px offset above bottom safe areas (`env(safe-area-inset-bottom)`).

## Elevation & Depth

This design system avoids harsh drop shadows, utilizing low-opacity, diffused indigo-tinted ambient shadows and subtle hairline borders for optical separation.

### Surface Elevation Levels
- **Level 0 (Canvas):** Flat base. Light `#F8FAFC`, Dark `#0B0F19`.
- **Level 1 (Card & Section):** Crisp border (`1px solid var(--border-subdued)`) paired with shadow `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Dropdowns, Floating Toolbars, Active Sheets):** Subtle indigo tint blur: `0 10px 25px -5px rgba(79, 70, 229, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Export Dialogs):** High diffusion overlay: `0 25px 50px -12px rgba(15, 23, 42, 0.25)`. Dark mode utilizes a dual-tier border: a 1px solid interior rim (`rgba(255, 255, 255, 0.08)`) with `rgba(0, 0, 0, 0.6)` ambient backing.

## Shapes

The geometric baseline is `roundedness: 2` (base 8px radius), providing a balanced curvature that complements circular and rounded QR dot styles without visual friction.

### Corner Radius Mapping
- **Input Fields, Tooltips & Dropdown Items:** 8px (`0.5rem`).
- **Standard Cards, Studio Control Panels:** 12px (`0.75rem`).
- **QR Preview Container & Major Cards:** 16px (`1rem`).
- **Chips, Pill Toggles, Status Badges & Icon Buttons:** 9999px (Full pill).

## Components

### 1. Buttons
- **Primary:** Background `primary-600`, text `white`, hover `primary-700`, active `primary-800`. Smooth 150ms transition. Subtle inset shadow on active state (`inset 0 1px 2px rgba(0, 0, 0, 0.2)`).
- **Secondary:** Surface background with `1px solid var(--border-subdued)`, text `neutral-700` (Light) / `neutral-200` (Dark). Hover surface `var(--surface-raised)`.
- **Ghost / Utility:** Transparent background, hover tint `rgba(79, 70, 229, 0.08)`.

### 2. QR Code Preview Container & Quiet Zone Rules
- **Container Structure:** Centered preview tile resting on an elevated Level 1 canvas with a subtle dot-grid transparency background.
- **The Quiet Zone:** The QR preview must enforce a mandatory minimum quiet zone of **4 modules** (or 10% total width) around the matrix bounds to guarantee scanning reliability. This margin must visually adjust if custom background padding is applied by the user.
- **Download Action Island:** Suspended directly beneath the preview container, styled as a pill button group (SVG, PNG, PDF, Copy).

### 3. Form Inputs & Steppers
- **Height & Padding:** Standard height 40px, padding `0 12px`, typography `body-md`.
- **Borders & Focus:** Default border `1px solid var(--border-subdued)`. Focused state shifts to `1.5px solid #4F46E5` with an outer ring glow `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- **Sliders & Color Pickers:** Low-profile 4px tracks with an elevated 18px circular thumb flanked by inline hex input text fields.

### 4. Selection Chips & Segmented Controls
- **Segmented Control (e.g., Static vs. Dynamic):** Embedded track in `rgba(0, 0, 0, 0.04)` (Light) or `rgba(255, 255, 255, 0.04)` (Dark). Active indicator uses a raised white/slate-800 pill with Level 1 elevation.
- **Chips (Shape / Eye Selectors):** Square 44x44px selector buttons with rounded 8px corners, featuring miniature vector iconography of the dot styles (Square, Rounded, Dots, Classy). Active chip shows a `2px solid #4F46E5` perimeter with `primary-50` background tint.

### 5. Cards & Section Expanders
- **Accordion Panels:** Bordered container with collapsed headers showing active setting values (e.g., "Color: #4F46E5 • Level: High (30%)") in `label-sm` muted text.
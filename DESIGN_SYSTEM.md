# Design System - Business Loan CRM

## 🎨 Color Palette

### Primary Colors
```
Blue: #1741FF (Primary Brand Color)
  - Light: #E0E7FF
  - Dark: #1230CC
  - Usage: Primary buttons, active states, main CTAs

Indigo: #4F46E5 (Secondary Brand Color)
  - Light: #EEF2FF
  - Dark: #3730A3
  - Usage: Secondary actions, accents
```

### Status Colors
```
Green: #10B981 (Success)
  - Light: #D1FAE5
  - Dark: #047857
  - Usage: Success messages, positive trends, active status

Red: #EF4444 (Error/Danger)
  - Light: #FEE2E2
  - Dark: #DC2626
  - Usage: Errors, overdue, delete actions

Amber: #F59E0B (Warning)
  - Light: #FEF3C7
  - Dark: #D97706
  - Usage: Warnings, pending, caution

Purple: #A855F7 (Secondary Metric)
  - Light: #F3E8FF
  - Dark: #7E22CE
  - Usage: Secondary metrics, collections
```

### Neutral Colors
```
Gray: #6B7280 (Default Text)
  - 50: #F9FAFB (Lightest background)
  - 100: #F3F4F6
  - 200: #E5E7EB
  - 300: #D1D5DB
  - 400: #9CA3AF
  - 500: #6B7280
  - 600: #4B5563
  - 700: #374151
  - 800: #1F2937
  - 900: #111827 (Darkest text)
```

## 📐 Typography

### Font Family
```
Primary: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'Courier New', monospace
```

### Font Sizes
```
Display: 48px (font-bold)
Heading 1: 36px (font-bold)
Heading 2: 28px (font-bold)
Heading 3: 24px (font-bold)
Heading 4: 20px (font-semibold)
Heading 5: 18px (font-semibold)
Heading 6: 16px (font-semibold)
Body Large: 16px (font-normal)
Body: 14px (font-normal)
Body Small: 12px (font-normal)
Caption: 11px (font-normal)
Label: 12px (font-semibold)
```

### Font Weights
```
Light: 300
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

### Line Heights
```
Tight: 1.2
Normal: 1.5
Relaxed: 1.75
Loose: 2
```

## 📏 Spacing

### Base Unit: 4px

### Spacing Scale
```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
7: 28px
8: 32px
9: 36px
10: 40px
12: 48px
14: 56px
16: 64px
20: 80px
24: 96px
28: 112px
32: 128px
36: 144px
40: 160px
44: 176px
48: 192px
52: 208px
56: 224px
60: 240px
64: 256px
72: 288px
80: 320px
96: 384px
```

### Common Spacing
```
Padding: 4px, 8px, 12px, 16px, 24px, 32px
Margin: 8px, 16px, 24px, 32px, 48px
Gap: 8px, 12px, 16px, 24px, 32px
```

## 🎯 Components

### Buttons

#### Primary Button
```
Background: Gradient from-blue-600 to-indigo-600
Text: White, semibold
Padding: 12px 16px (md)
Border Radius: 8px
Shadow: lg
Hover: from-blue-700 to-indigo-700
Active: from-blue-800 to-indigo-800
Disabled: opacity-50, cursor-not-allowed
```

#### Secondary Button
```
Background: Gray-100
Text: Gray-900, semibold
Padding: 12px 16px (md)
Border: 1px Gray-300
Border Radius: 8px
Hover: Gray-200
```

#### Danger Button
```
Background: Gradient from-red-600 to-red-700
Text: White, semibold
Padding: 12px 16px (md)
Border Radius: 8px
Shadow: lg
Hover: from-red-700 to-red-800
```

### Cards

#### Standard Card
```
Background: White
Border: 1px Gray-200
Border Radius: 12px
Padding: 24px
Shadow: sm
Hover: shadow-md
```

#### KPI Card
```
Background: White
Border: 1px Gray-200
Border Radius: 12px
Padding: 24px
Shadow: sm
Icon Background: Color-50
Icon Color: Color-600
Accent: Gradient background
```

### Inputs

#### Text Input
```
Background: Gray-50
Border: 1px Gray-300
Border Radius: 8px
Padding: 12px 16px
Font Size: 14px
Focus: ring-2 ring-blue-500, border-transparent
Placeholder: Gray-400
```

#### Label
```
Font Size: 12px
Font Weight: Semibold
Color: Gray-700
Margin Bottom: 8px
```

### Tables

#### Header
```
Background: Gradient from-gray-50 to-gray-50
Border Bottom: 1px Gray-200
Padding: 16px 24px
Font Size: 12px
Font Weight: Semibold
Color: Gray-700
Text Transform: Uppercase
Letter Spacing: 0.05em
```

#### Row
```
Padding: 16px 24px
Border Bottom: 1px Gray-100
Background: White (odd), Gray-50 (even)
Hover: bg-blue-50
```

#### Cell
```
Font Size: 14px
Color: Gray-900
Padding: 16px 24px
```

### Alerts

#### Success Alert
```
Background: Green-50
Border: 1px Green-200
Border Radius: 8px
Padding: 16px
Icon: CheckCircleIcon, Green-600
Text: Green-800
```

#### Error Alert
```
Background: Red-50
Border: 1px Red-200
Border Radius: 8px
Padding: 16px
Icon: XCircleIcon, Red-600
Text: Red-800
```

#### Warning Alert
```
Background: Amber-50
Border: 1px Amber-200
Border Radius: 8px
Padding: 16px
Icon: ExclamationIcon, Amber-600
Text: Amber-800
```

#### Info Alert
```
Background: Blue-50
Border: 1px Blue-200
Border Radius: 8px
Padding: 16px
Icon: InformationCircleIcon, Blue-600
Text: Blue-800
```

## 🎬 Animations

### Transitions
```
Duration: 200ms (default)
Timing: ease-in-out
Properties: all, colors, opacity, transform
```

### Common Animations
```
Fade In: opacity 200ms
Slide In: transform 200ms
Scale: transform 200ms
Spin: rotate 1s infinite
Pulse: opacity 2s infinite
Bounce: transform 1s infinite
```

## 📱 Responsive Breakpoints

```
Mobile: 0px - 639px (default)
Tablet: 640px - 1023px (sm:)
Desktop: 1024px - 1279px (md:)
Large Desktop: 1280px+ (lg:)
```

### Breakpoint Usage
```jsx
// Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Hide on mobile
<div className="hidden md:block">
  Desktop only
</div>

// Show on mobile
<div className="md:hidden">
  Mobile only
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Items
</div>
```

## ♿ Accessibility

### Color Contrast
```
Normal Text: 4.5:1 minimum
Large Text: 3:1 minimum
UI Components: 3:1 minimum
```

### Focus States
```
Outline: 2px solid blue-500
Offset: 2px
Visible: Always visible
```

### Touch Targets
```
Minimum Size: 44px × 44px
Spacing: 8px minimum between targets
```

## 🎨 Usage Examples

### Color Usage
```jsx
// Primary action
<button className="bg-blue-600 hover:bg-blue-700">
  Primary Action
</button>

// Success state
<div className="bg-green-50 text-green-800">
  Success Message
</div>

// Error state
<div className="bg-red-50 text-red-800">
  Error Message
</div>

// Warning state
<div className="bg-amber-50 text-amber-800">
  Warning Message
</div>
```

### Spacing Usage
```jsx
// Padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Margin
<div className="mb-4 md:mb-6 lg:mb-8">
  Content
</div>

// Gap
<div className="flex gap-4 md:gap-6 lg:gap-8">
  Items
</div>
```

### Typography Usage
```jsx
// Heading
<h1 className="text-3xl md:text-4xl font-bold">
  Page Title
</h1>

// Body
<p className="text-base text-gray-700">
  Body text
</p>

// Label
<label className="text-sm font-semibold text-gray-700">
  Form Label
</label>

// Caption
<p className="text-xs text-gray-500">
  Caption text
</p>
```

## 📊 Component Sizes

### Button Sizes
```
Small: 8px 12px, text-sm
Medium: 12px 16px, text-sm
Large: 16px 24px, text-base
Extra Large: 20px 32px, text-lg
```

### Card Sizes
```
Small: 200px width
Medium: 300px width
Large: 400px width
Full: 100% width
```

### Icon Sizes
```
Extra Small: 16px (w-4 h-4)
Small: 20px (w-5 h-5)
Medium: 24px (w-6 h-6)
Large: 32px (w-8 h-8)
Extra Large: 48px (w-12 h-12)
```

## 🎯 Best Practices

### Color
- Use colors consistently
- Ensure sufficient contrast
- Don't rely on color alone
- Use semantic colors (green=success, red=error)

### Typography
- Use consistent font sizes
- Maintain proper hierarchy
- Use appropriate weights
- Ensure readability

### Spacing
- Use consistent spacing
- Maintain visual rhythm
- Use multiples of base unit
- Align elements to grid

### Components
- Use consistent styling
- Maintain visual consistency
- Follow established patterns
- Test accessibility

## 📝 Implementation

### Tailwind CSS Classes
```jsx
// Colors
className="bg-blue-600 text-white"
className="border-gray-200"
className="hover:bg-blue-700"

// Spacing
className="p-4 m-2 gap-3"
className="px-4 py-2"
className="mb-4 mt-2"

// Typography
className="text-lg font-bold"
className="text-sm text-gray-600"

// Responsive
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"
className="grid grid-cols-1 md:grid-cols-2"
```

---

**Design System Version**: 1.0
**Last Updated**: 2024
**Status**: Active

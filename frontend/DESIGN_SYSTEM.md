# Design System - Production CRM Frontend

## 🎨 Color System

### Primary Colors
```
Primary Blue:     #1741FF (RGB: 23, 65, 255)
Primary Dark:     #1230cc (RGB: 18, 48, 204)
Primary Light:    #E9EDFF (RGB: 233, 237, 255)
```

### Neutral Colors
```
White:            #FFFFFF
Background:       #F7F8FA (Very light gray)
Gray 50:          #f8fafc
Gray 100:         #f1f5f9
Gray 200:         #e2e8f0
Gray 300:         #cbd5e1
Gray 400:         #94a3b8
Gray 500:         #64748b
Gray 600:         #475569
Gray 700:         #334155
Gray 800:         #1e293b
Gray 900:         #0f172a
```

### Semantic Colors
```
Success:          #22c55e (Green)
Success Light:    #f0fdf4
Success Dark:     #16a34a

Warning:          #f59e0b (Orange)
Warning Light:    #fffbeb
Warning Dark:     #d97706

Danger:           #ef4444 (Red)
Danger Light:     #fef2f2
Danger Dark:     #dc2626
```

---

## 📐 Typography

### Font Family
```
Primary: Inter
Fallback: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
```

### Font Sizes & Weights

| Usage | Size | Weight | Line Height | Example |
|-------|------|--------|-------------|---------|
| Page Title | 30px | Bold (700) | 36px | "Dashboard" |
| Section Header | 18px | Semibold (600) | 28px | "Recent Activity" |
| Card Title | 16px | Semibold (600) | 24px | "Customer Name" |
| Body Text | 14px | Regular (400) | 21px | "Description text" |
| Small Text | 12px | Medium (500) | 18px | "Labels" |
| Tiny Text | 11px | Medium (500) | 16px | "Timestamps" |

### Text Colors
```
Primary Text:     #1e293b (Gray 800)
Secondary Text:   #64748b (Gray 500)
Tertiary Text:    #94a3b8 (Gray 400)
Disabled Text:    #cbd5e1 (Gray 300)
```

---

## 🎯 Spacing System

### Spacing Scale (in pixels)
```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
6:    24px
8:    32px
12:   48px
16:   64px
```

### Common Spacing Patterns

| Element | Padding | Margin |
|---------|---------|--------|
| Card | 24px | 0 |
| Button | 10px 16px | 0 |
| Input | 10px 16px | 0 |
| Section | 0 | 24px |
| Page | 24px | 0 |

---

## 🔲 Border Radius

```
Small:    4px   (rounded)
Medium:   8px   (rounded-lg)
Large:    12px  (rounded-xl)
XLarge:   16px  (rounded-2xl)
Full:     9999px (rounded-full)
```

### Usage
- **Buttons**: 8px
- **Cards**: 12px
- **Modals**: 16px
- **Avatars**: 9999px (full circle)
- **Inputs**: 8px

---

## 💫 Shadows

### Shadow Levels

```
None:     none
Small:    0 1px 2px 0 rgba(0, 0, 0, 0.05)
Medium:   0 4px 6px -1px rgba(0, 0, 0, 0.1)
Large:    0 10px 15px -3px rgba(0, 0, 0, 0.1)
XLarge:   0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Usage
- **Cards**: Small shadow
- **Hover Cards**: Medium shadow
- **Modals**: Large shadow
- **Dropdowns**: Medium shadow

---

## 🎨 Component Styling

### Buttons

#### Primary Button
```jsx
className="px-4 py-2.5 bg-[#1741FF] text-white rounded-lg font-medium hover:bg-[#1230cc] transition"
```
- Background: Primary Blue
- Text: White
- Padding: 10px 16px
- Border Radius: 8px
- Hover: Darker blue
- Transition: Smooth

#### Secondary Button
```jsx
className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
```
- Background: White
- Border: Gray 300
- Text: Gray 700
- Padding: 10px 16px
- Border Radius: 8px
- Hover: Light gray background

#### Disabled Button
```jsx
className="px-4 py-2.5 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
```
- Background: Gray 400
- Text: White
- Cursor: Not allowed

### Input Fields

```jsx
className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition"
```
- Border: Gray 300
- Padding: 10px 16px
- Border Radius: 8px
- Focus Ring: Primary blue
- Focus Border: Transparent

### Cards

```jsx
className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
```
- Background: White
- Border: Gray 100
- Padding: 24px
- Border Radius: 12px
- Shadow: Small
- Hover Shadow: Medium

### Status Badges

#### Success
```jsx
className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
```

#### Warning
```jsx
className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
```

#### Danger
```jsx
className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
```

#### Info
```jsx
className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
```

---

## 🎬 Animations & Transitions

### Transition Timing
```
Fast:     150ms
Normal:   200ms
Slow:     300ms
```

### Common Transitions
```jsx
// Smooth color transition
className="transition"

// Smooth all properties
className="transition-all"

// Specific property
className="transition-colors"

// Custom duration
className="transition duration-300"
```

### Hover Effects
```jsx
// Subtle shadow increase
hover:shadow-md

// Background color change
hover:bg-gray-50

// Text color change
hover:text-gray-700

// Scale effect
hover:scale-105
```

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   (sm)
Tablet:   640px - 1024px (md, lg)
Desktop:  > 1024px  (xl, 2xl)
```

### Grid Layouts

#### Mobile (1 column)
```jsx
className="grid grid-cols-1 gap-6"
```

#### Tablet (2 columns)
```jsx
className="grid grid-cols-1 md:grid-cols-2 gap-6"
```

#### Desktop (3-4 columns)
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

---

## 🎯 Layout Patterns

### Page Layout
```
┌─────────────────────────────────────┐
│         Topbar (64px)               │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │   Content Area           │
│ (264px)  │   (Scrollable)           │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

### Content Spacing
```
Page Padding:     24px
Section Gap:      24px
Card Padding:     24px
Element Gap:      16px
```

### Card Layout
```
┌─────────────────────────────┐
│  Title (18px, Semibold)     │
│  Description (14px, Gray)   │
│                             │
│  Content Area               │
│                             │
│  [Action Buttons]           │
└─────────────────────────────┘
```

---

## 🎨 Color Usage Guidelines

### Primary Blue (#1741FF)
- **Use for**: Primary buttons, active states, links, highlights
- **Avoid**: Large background areas (use light blue instead)

### Light Blue (#E9EDFF)
- **Use for**: Active menu items, hover states, light backgrounds
- **Avoid**: Text (too light)

### Gray (#64748b)
- **Use for**: Secondary text, descriptions, disabled states
- **Avoid**: Primary text (use darker gray)

### Green (#22c55e)
- **Use for**: Success states, positive indicators, completed items
- **Avoid**: Warnings or errors

### Orange (#f59e0b)
- **Use for**: Warnings, pending states, caution indicators
- **Avoid**: Success or error states

### Red (#ef4444)
- **Use for**: Errors, danger, critical alerts, DPD indicators
- **Avoid**: Warnings (use orange instead)

---

## 📊 Data Visualization

### Chart Colors
```
Primary:   #1741FF (Blue)
Success:   #22c55e (Green)
Warning:   #f59e0b (Orange)
Danger:    #ef4444 (Red)
Secondary: #64748b (Gray)
```

### DPD Bucket Colors
```
0-15 DPD:   #22c55e (Green)
15-30 DPD:  #f59e0b (Orange)
30-60 DPD:  #f97316 (Deep Orange)
60+ DPD:    #ef4444 (Red)
```

---

## ♿ Accessibility

### Color Contrast
- **Text on White**: Minimum 4.5:1 ratio
- **Text on Color**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio

### Focus States
```jsx
// Always include focus ring
focus:ring-2 focus:ring-[#1741FF] focus:ring-offset-2
```

### Semantic HTML
- Use `<button>` for buttons
- Use `<input>` for inputs
- Use `<label>` for labels
- Use `<table>` for tables
- Use `<nav>` for navigation

### ARIA Labels
```jsx
<button aria-label="Close modal">✕</button>
<div role="alert">Error message</div>
<nav aria-label="Main navigation">...</nav>
```

---

## 🎓 Design Principles

### 1. Consistency
- Use the same colors, spacing, and typography throughout
- Follow the same patterns for similar components
- Maintain visual hierarchy

### 2. Clarity
- Use clear labels and descriptions
- Provide visual feedback for actions
- Show loading and error states

### 3. Simplicity
- Minimize visual clutter
- Use whitespace effectively
- Avoid unnecessary decorations

### 4. Accessibility
- Ensure sufficient color contrast
- Provide keyboard navigation
- Use semantic HTML

### 5. Responsiveness
- Design for mobile first
- Test on all breakpoints
- Ensure touch-friendly targets (44px minimum)

---

## 🔄 Component States

### Button States
```
Default:   Blue background, white text
Hover:     Darker blue background
Active:    Even darker blue
Disabled:  Gray background, gray text
Loading:   Gray background, spinner
```

### Input States
```
Default:   Gray border
Focus:     Blue ring, blue border
Error:     Red border, red ring
Disabled:  Gray background, gray border
```

### Card States
```
Default:   White background, small shadow
Hover:     White background, medium shadow
Active:    Light blue background, blue border
Disabled:  Gray background, gray text
```

---

## 📐 Sizing

### Common Sizes
```
XS:  8px
SM:  12px
MD:  16px
LG:  24px
XL:  32px
2XL: 48px
```

### Icon Sizes
```
Small:    16px (w-4 h-4)
Medium:   20px (w-5 h-5)
Large:    24px (w-6 h-6)
XLarge:   32px (w-8 h-8)
```

### Avatar Sizes
```
Small:    32px (w-8 h-8)
Medium:   40px (w-10 h-10)
Large:    48px (w-12 h-12)
XLarge:   64px (w-16 h-16)
```

---

## 🎯 Best Practices

1. **Maintain Consistency**: Use the same colors, spacing, and typography
2. **Respect Whitespace**: Don't overcrowd the interface
3. **Use Color Meaningfully**: Blue for primary, green for success, red for danger
4. **Provide Feedback**: Show loading, error, and success states
5. **Ensure Accessibility**: Test with screen readers and keyboard navigation
6. **Test Responsiveness**: Verify on mobile, tablet, and desktop
7. **Follow Hierarchy**: Use size and weight to establish visual hierarchy
8. **Use Icons Consistently**: Use Lucide icons throughout
9. **Optimize Performance**: Minimize animations and transitions
10. **Document Changes**: Keep design system updated

---

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Material Design**: https://material.io/design
- **Apple Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Complete ✅

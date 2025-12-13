# 🎨 Visual Design Reference Guide

## Color Palette

### Primary Colors
```
Primary Blue
  Hex: #1741FF
  RGB: 23, 65, 255
  Usage: Main buttons, links, primary actions

Primary Dark
  Hex: #0F2ECC
  RGB: 15, 46, 204
  Usage: Hover states, darker accents

Primary Light
  Hex: #E9EDFF
  RGB: 233, 237, 255
  Usage: Light backgrounds, hover overlays
```

### Accent Colors
```
Purple (Accent)
  Hex: #7C3AED
  Usage: Special features, secondary gradient

Cyan (Accent)
  Hex: #06B6D4
  Usage: Accent components, highlights

Emerald (Accent)
  Hex: #10B981
  Usage: Success states, positive feedback
```

### Status Colors
```
Success Green:    #22C55E
Warning Orange:   #F59E0B
Danger Red:       #EF4444
Info Blue:        #0EA5E9
```

### Neutral Colors
```
Light Gray:       #F7F8FA (backgrounds)
Medium Gray:      #E5E7EB (borders)
Dark Gray:        #374151 (text)
White:            #FFFFFF (cards)
```

---

## Gradient Combinations

### Gradient Primary
```css
linear-gradient(135deg, #1741FF 0%, #0F2ECC 100%)
```
**Used for**: Main buttons, primary cards, backgrounds

### Gradient Accent
```css
linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)
```
**Used for**: Accent cards, special features

### Gradient Success
```css
linear-gradient(135deg, #10B981 0%, #06B6D4 100%)
```
**Used for**: Success cards, positive indicators

### Gradient Warm
```css
linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)
```
**Used for**: Warning cards, hot zones

### Gradient Subtle
```css
linear-gradient(135deg, #F7F8FA 0%, #E9EDFF 100%)
```
**Used for**: Subtle backgrounds, light overlays

---

## Typography Specifications

### Font Families
- **Display**: Poppins (weights: 600, 700)
- **Body/UI**: Inter (weights: 400, 500, 600, 700)

### Size Scale
```
Display Large:    3.5rem   (56px)  - line-height 1.1
Display Medium:   2.875rem (46px)  - line-height 1.2
Display Small:    2.25rem  (36px)  - line-height 1.2

Heading XL:       2rem     (32px)  - line-height 1.3
Heading Large:    1.875rem (30px)  - line-height 1.3
Heading Medium:   1.5rem   (24px)  - line-height 1.4
Heading Small:    1.25rem  (20px)  - line-height 1.4

Body Large:       1.125rem (18px)  - line-height 1.6
Body Medium:      1rem     (16px)  - line-height 1.6
Body Small:       0.875rem (14px)  - line-height 1.5
```

### Font Weights
```
Regular:    400
Medium:     500
Semibold:   600
Bold:       700
```

---

## Shadow System

### Card Shadows
```
Shadow Small:  0 6px 18px rgba(23, 65, 255, 0.06)
Shadow Medium: 0 10px 30px rgba(2, 6, 23, 0.08)
Shadow Large:  0 20px 40px rgba(2, 6, 23, 0.1)
```

### Glow Effects
```
Glow Blue:    0 0 30px rgba(23, 65, 255, 0.15)
Glow Purple:  0 0 30px rgba(124, 58, 237, 0.15)
```

---

## Spacing System

### 4px Grid
```
2px    (0.125rem)
4px    (0.25rem)
6px    (0.375rem)
8px    (0.5rem)
12px   (0.75rem)
16px   (1rem)
20px   (1.25rem)
24px   (1.5rem)
32px   (2rem)
40px   (2.5rem)
48px   (3rem)
```

### Common Patterns
```
Padding Small:    8px 12px
Padding Medium:   12px 16px
Padding Large:    16px 24px

Margin Small:     8px
Margin Medium:    16px
Margin Large:     24px
```

---

## Border Radius

```
Small:  0.375rem (6px)
Normal: 0.5rem   (8px)
Medium: 0.75rem  (12px)
Large:  1rem     (16px)
XL:     1.5rem   (24px)
2XL:    2rem     (32px)
Full:   9999px   (rounded)
```

---

## Component Specifications

### Buttons
```
Height:     36px - 40px
Padding:    12px 24px (medium)
Border:     0 (no border on primary/secondary)
Border:     2px (on secondary outline)
Radius:     8px
Font:       Medium Inter, 14-16px
Shadow:     None (standard), Glow (hover)
Transition: 300ms ease-out
```

### Input Fields
```
Height:     40px - 44px
Padding:    12px 16px
Border:     2px solid #E5E7EB
Border (Focus): 2px solid #1741FF + ring
Radius:     8px
Font:       Regular Inter, 14-16px
Transition: 300ms ease-out
```

### Cards
```
Padding:    24px
Radius:     16px (default), 24px (elevated)
Border:     1px solid rgba(255,255,255,0.2)
Shadow:     card-sm (default), card-md (elevated)
Transition: 300ms ease-out
```

### Badges
```
Height:     24px - 28px
Padding:    4px 12px
Radius:     16px (pill-shaped)
Font:       Semibold Inter, 12px
Spacing:    No gap
```

### Modal
```
Width:      max-w-md (default, 448px)
Radius:     16px
Padding:    24px
Shadow:     card-lg
Backdrop:   Black 40% opacity + blur
Animation:  fadeInUp 600ms
Transition: 300ms ease-out
```

---

## Animation Specifications

### Fade In Up
```
Duration:     600ms
Easing:       ease-out
Transform:    translateY(20px) to translateY(0)
Opacity:      0 to 1
```

### Slide In Left
```
Duration:     600ms
Easing:       ease-out
Transform:    translateX(-20px) to translateX(0)
Opacity:      0 to 1
```

### Pulse Glow
```
Duration:     2s
Iteration:    infinite
Transform:    None
Shadow:       0 0 20px → 0 0 40px → 0 0 20px
```

### Hover Effects
```
Scale:        1 to 1.05
Translate-Y:  0 to -4px
Transition:   300ms ease-out
Shadow:       sm to md
```

### Focus States
```
Ring:         2px rgba(23, 65, 255, 0.2)
Border:       2px #1741FF
Transition:   200ms ease-out
```

---

## Responsive Breakpoints

### Tailwind Defaults
```
sm:   640px   (small phones)
md:   768px   (tablets)
lg:   1024px  (desktops)
xl:   1280px  (wide screens)
2xl:  1536px  (extra large)
```

### Common Patterns
```
1 col:   default (mobile)
2 cols:  md:grid-cols-2 (tablet up)
3 cols:  lg:grid-cols-3 (desktop up)
4 cols:  xl:grid-cols-4 (wide up)
```

### Typography Scaling
```
Mobile:  Base size
Tablet:  1.1x scale
Desktop: 1.2x scale
Wide:    1.3x scale
```

---

## Component Colors

### KPI Cards
```
Primary:  from-primary/10 to-primary-light/20
Success:  from-success/10 to-emerald-50
Warning:  from-warning/10 to-orange-50
Danger:   from-danger/10 to-red-50
```

### Buttons
```
Primary:    gradient-primary, text-white
Secondary:  white with 2px primary border
Ghost:      transparent, text-primary
Disabled:   opacity-50
```

### Badges
```
Default:  bg-gray-100, text-gray-800
Success:  bg-green-50, text-green-700
Warning:  bg-yellow-50, text-yellow-800
Danger:   bg-red-50, text-red-700
Info:     bg-blue-50, text-blue-700
```

### Timeline
```
Success:  bg-success, dot icon ✓
Warning:  bg-warning, dot icon ⚠
Info:     bg-info, dot icon ℹ
Default:  bg-primary, dot icon •
```

---

## Accessibility

### Color Contrast
```
Large Text (18px+):     4.5:1 (AA standard)
Normal Text (< 18px):   7:1 (AAA standard)
Graphics & UI:          3:1 (minimum)
```

### Focus Indicators
```
Style:      2px ring + 2px border
Color:      Primary blue (#1741FF)
Visible:    Always on keyboard focus
Duration:   Instant appearance
```

### Keyboard Navigation
```
Tab:        Move through interactive elements
Shift+Tab:  Move backward
Enter:      Activate button/link
Space:      Toggle checkbox/radio
Escape:     Close modal/dropdown
```

---

## Usage Recommendations

### When to Use Gradients
✅ Button backgrounds
✅ Card backgrounds (elevated cards)
✅ Page backgrounds
✅ Icon backgrounds
✅ Hero sections

### When NOT to Use Gradients
❌ Text (use solid colors)
❌ Status indicators (use solid colors)
❌ Form inputs (keep simple)
❌ Subtle backgrounds (too busy)

### Color Meaning
```
🟢 Green   = Success, positive, go
🔴 Red     = Danger, error, stop
🟠 Orange  = Warning, caution, attention
🔵 Blue    = Primary, info, neutral
💜 Purple  = Special, accent, premium
⚪ Gray    = Disabled, secondary, muted
```

### Typography Usage
```
Display:  Page titles, hero sections
Heading:  Section titles, card titles
Body:     Regular content, descriptions
```

---

## Example Combinations

### Success Card
```
Background:   gradient-success
Border:       border-success/20
Icon:         ✓
Text:         text-success
Gradient:     to emerald tones
```

### Warning Card
```
Background:   gradient-warm
Border:       border-warning/20
Icon:         ⚠️
Text:         text-warning
Gradient:     to orange/yellow tones
```

### Info Card
```
Background:   gradient-primary
Border:       border-primary/20
Icon:         ℹ️
Text:         text-primary
Gradient:     to blue/purple tones
```

### Error Card
```
Background:   bg-danger/10
Border:       border-danger/20
Icon:         ✕
Text:         text-danger
Color:        Solid red tones
```

---

## File Structure for Styling

```
src/
├── styles/
│   └── tailwind.css              # Main styles
├── components/
│   └── ui/
│       ├── Input.tsx             # Component
│       ├── Button.tsx            # Component
│       └── ...
├── pages/
│   └── Dashboard.tsx             # Page
└── App.tsx                       # Main
```

---

## Performance Tips

1. **Use CSS Classes** - Not inline styles
2. **Leverage Tailwind** - Pre-compiled CSS
3. **Avoid Complex Gradients** - Keep to 2-3 stops
4. **Optimize Shadows** - Use predefined options
5. **Batch Animations** - Use staggered delays

---

**Reference Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Complete and Ready to Use ✅

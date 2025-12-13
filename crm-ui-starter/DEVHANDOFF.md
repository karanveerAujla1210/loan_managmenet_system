# CRM UI Starter — Dev Handoff

This file documents tokens, Tailwind config notes, component props contracts and Storybook suggestions for the CRM UI kit.

## Tokens (from design spec)
- Colors: `primary: #1741FF`, `primary-dark: #0F2ECC`, `primary-light: #E9EDFF`, `white: #FFFFFF`, `light-gray: #F7F8FA`, `medium-gray: #E5E7EB`, `dark-gray: #374151`, `success: #22C55E`, `warning: #F59E0B`, `danger: #EF4444`, `info: #0EA5E9`.
- Radius: default `rounded-lg`, cards `rounded-xl` (1rem).
- Shadows: `shadow-card-sm` and `shadow-card-md` defined in `tailwind.config.cjs`.

## Tailwind Notes
- `tailwind.config.cjs` extends colors, fontFamily (Inter), radii and boxShadow.
- Entry CSS file: `src/styles/tailwind.css` — import into `main.tsx` or `index.html`.

## Component Contracts (summary)
- `Button` (src/components/ui/Button.tsx): props extend `button` attributes; `variant` union `'primary' | 'secondary' | 'danger'`.
- `Input` (src/components/ui/Input.tsx): simple controlled input. Use `className` to extend.
- `Card` (src/components/ui/Card.tsx): props `title?: string`, `footer?: ReactNode`.
- `Kpi` (src/components/ui/Kpi.tsx): props `title,value,delta,spark`.
- `Table` (src/components/ui/Table.tsx): generic table with `columns: { key,label,render? }[]` and `data: any[]`.
- `OTPInput` (src/components/ui/OTPInput.tsx): `length?: number`, `onChange?(value)`.

## Accessibility
- All interactive controls must have associated labels.
- Modals must implement focus-trap; keyboard closable (Esc).
- Ensure color contrast >= AA for text and UI elements.

## Storybook
- Add stories for each component covering states: default, hover, active, disabled, loading, error.

## Testing
- Unit tests with Jest + React Testing Library for component behaviour.
- E2E tests for key flows with Cypress: auth → dashboard → case-close.

## Next steps
- Add Storybook config and stories, integrate design tokens into `tailwind.config` values, and wire components to the auth/context and API services.

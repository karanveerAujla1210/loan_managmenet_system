# Business Loan CRM - Unified Frontend

Merged frontend combining Vite (React Router) and Next.js implementations.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development

**Next.js (default, recommended for Vercel):**
```bash
npm run dev
# Open http://localhost:3000
```

**Vite (alternative):**
```bash
npm run dev:vite
# Open http://localhost:5173
```

### Build

**Next.js:**
```bash
npm run build
npm start
```

**Vite:**
```bash
npm run build:vite
npm preview
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_NAME=Business Loan CRM
```

## Deployment to Vercel

1. Connect this folder to Vercel
2. Root Directory: `frontend-unified`
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Add environment variables in Vercel dashboard

## Project Structure

```
src/
├── app/           # Next.js App Router
├── pages/         # React Router pages
├── components/    # Shared React components
├── services/      # API client services
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── styles/        # Global styles
```

## Original Implementations

- `frontend/` - Vite + React Router (preserved)
- `frontend-web/` - Next.js (preserved)

Both remain intact and can be used independently.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Formik
- **State**: React Query + Context API
- **Charts**: Recharts
- **UI**: Headless UI + Lucide Icons
- **Build**: Vite (alternative) + Next.js

## Notes

- All original files preserved in `frontend/` and `frontend-web/`
- Unified folder is the primary deployment target
- Supports both Next.js and Vite workflows
- TypeScript configured for both frameworks

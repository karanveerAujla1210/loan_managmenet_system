# Frontend Unified - Merge Guide

This folder merges both `frontend/` (Vite) and `frontend-web/` (Next.js) implementations.

## Structure

```
frontend-unified/
├── src/                    # Shared source code
│   ├── app/               # Next.js App Router (from frontend-web)
│   ├── pages/             # React Router pages (from frontend)
│   ├── components/        # Shared components
│   ├── services/          # API services
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities
│   └── styles/            # Global styles
├── public/                # Static assets
├── package.json           # Unified dependencies
├── next.config.ts         # Next.js config
├── vite.config.js         # Vite config
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── vercel.json            # Vercel deployment config
```

## Migration Steps

### 1. Copy Vite Frontend Assets
```bash
cp -r frontend/src/* frontend-unified/src/
cp -r frontend/public/* frontend-unified/public/
```

### 2. Copy Next.js Frontend Assets
```bash
cp -r frontend-web/src/app frontend-unified/src/
cp -r frontend-web/public/* frontend-unified/public/
```

### 3. Install Dependencies
```bash
cd frontend-unified
npm install
```

### 4. Development

**Next.js (default):**
```bash
npm run dev
```

**Vite (alternative):**
```bash
npm run dev:vite
```

### 5. Build

**Next.js (for Vercel):**
```bash
npm run build
```

**Vite (alternative):**
```bash
npm run build:vite
```

## Deployment to Vercel

1. Connect `frontend-unified` folder to Vercel
2. Set Root Directory: `frontend-unified`
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

## Original Folders

- `frontend/` - Vite + React Router implementation (preserved)
- `frontend-web/` - Next.js implementation (preserved)

Both remain intact for reference and can be used independently if needed.

## Switching Between Implementations

### Use Next.js (Recommended for Vercel)
```bash
npm run dev
npm run build
npm start
```

### Use Vite
```bash
npm run dev:vite
npm run build:vite
npm preview
```

## Notes

- All original files in `frontend/` and `frontend-web/` are preserved
- This unified folder is the primary deployment target
- Shared dependencies are consolidated in one `package.json`
- TypeScript and Tailwind are configured for both frameworks

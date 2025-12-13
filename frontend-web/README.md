# Frontend (frontend-web)

This folder contains the React + Vite frontend for the Loan Management CRM.

Quick start (from repo root):

```bash
cd frontend-web
npm install
npm run dev
```

Run tests:

```bash
cd frontend-web
npm install
npm test
```

Notes:
- Environment variables: copy `.env.example` to `.env` and set `VITE_API_URL`.
- Uses `react-query` for data fetching, and `axios` configured in `src/services/api.js`.
- Mock fallbacks exist in `src/services/*` if backend is unavailable.

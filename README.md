# NBFC Loan Management System

Complete multi-platform loan management system with backend, web frontend, mobile app, and desktop application.

## Architecture
- **Backend**: Node.js + Express + MongoDB + JWT
- **Frontend Web**: React + Vite + TailwindCSS
- **Mobile App**: Expo React Native + SQLite Offline Sync
- **Desktop App**: Electron

## Quick Start
```bash
# Install all dependencies
npm run install-all

# Start all services
npm run dev-all
```

## Project Structure
```
├── backend/          # Node.js API server
├── frontend-web/     # React web dashboard
├── mobile-app/       # Expo React Native app
├── desktop-app/      # Electron desktop app
├── infrastructure/   # Docker, configs
├── docs/            # Documentation
└── scripts/         # Automation scripts
```

## Features
- Loan Origination & Management
- Payment Processing & Auto-allocation
- Collections Engine with DPD calculation
- Role-based Access Control
- Offline-first Mobile Collections
- Real-time Dashboard Analytics
- Multi-platform Synchronization
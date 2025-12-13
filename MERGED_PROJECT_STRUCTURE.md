# Loan Management System - Merged Project Structure

**Version 2.0 - Unified Backend & Frontend Architecture**

## 📋 Overview

This document describes the consolidated loan management system project structure after merging:
- ✅ `backend/` - Primary backend (v1.0 + v2.0 enterprise features)
- ✅ `frontend/` - Primary frontend (formerly `frontend-web/`)
- 📚 `backend-new/` - Reference for advanced patterns (kept for reference)
- 📚 `loan-crm-backend/` - Alternative implementations (kept for reference)
- 📚 `crm-ui-starter/` - UI starter template (kept for reference)

## 🏗️ Project Root Structure

```
loan-management-system/
├── backend/                    # ✅ PRIMARY BACKEND
│   ├── src/
│   │   ├── config/            # Database, Redis, Logger config
│   │   └── server.js          # Entry point
│   ├── controllers/           # HTTP request handlers
│   ├── services/              # Business logic layer
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── middleware/            # Express middleware (auth, validation, error handling)
│   ├── cron/                  # Background jobs & cron tasks
│   ├── utils/                 # Helper functions & utilities
│   ├── scripts/               # Data migration & setup scripts
│   ├── tests/                 # Test suite (Jest)
│   ├── logs/                  # Application logs
│   ├── package.json           # Enhanced v2.0 with enterprise scripts
│   ├── Dockerfile             # Production container
│   ├── .env.example           # Environment template
│   └── server.js              # Alternative entry (backward compat)
│
├── frontend/                   # ✅ PRIMARY FRONTEND
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Dashboard/     # Dashboard components
│   │   │   ├── Layout/        # Page layouts
│   │   │   ├── ui/            # UI component library
│   │   │   └── ...
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React Context providers
│   │   ├── utils/             # Helper utilities
│   │   ├── styles/            # CSS modules & styling
│   │   ├── lib/               # Third-party library configs
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite build config
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.cjs     # PostCSS config
│   ├── package.json           # Frontend dependencies
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx reverse proxy config
│   └── .env.example           # Environment template
│
├── backend-new/               # 📚 Reference Implementation (v2.0 patterns)
│   └── [Contains modular structure patterns for reference]
│
├── loan-crm-backend/          # 📚 Alternative Implementation (reference)
│   └── [Contains alternative patterns and utilities]
│
├── crm-ui-starter/            # 📚 UI Starter Template (reference)
│   └── [Contains UI component starter templates]
│
├── docs/                      # 📖 Documentation
│   ├── api/                   # API documentation
│   ├── architecture-diagrams/ # System architecture
│   └── ...
│
├── infrastructure/            # 🐳 Deployment & DevOps
├── nginx/                     # Nginx configurations
├── docker-compose.yml         # Local development stack
├── docker-compose.prod.yml    # Production deployment
├── vercel.json                # Vercel deployment config
├── .env.example               # Root environment template
├── LOAN_ENGINE_COMPLETE.md    # Loan engine documentation
├── MERGED_PROJECT_STRUCTURE.md # This file
└── README.md                  # Project overview

```

## 🔄 What Was Merged

### Backend Enhancements (v2.0)

**From `backend-new/`:**
- Enhanced npm scripts (lint, build, docs:generate, security:audit)
- Enterprise dependencies (winston logging, bull queues, passport auth, swagger)
- Advanced security packages (snyk, eslint with airbnb config)
- PDF & file generation (pdf-lib, pdfkit, sharp, xlsx)
- Communication tools (twilio, nodemailer)
- Data processing (csv-parser, cheerio for web scraping)
- Task queue support (bull, ioredis)

**Package.json Updates:**
```json
{
  "version": "2.0.0",
  "description": "Production-grade NBFC Loan Management Backend API",
  "scripts": {
    "lint": "eslint src/ controllers/ middleware/ ...",
    "build": "npm run lint && npm test",
    "security:audit": "npm audit",
    "docs:generate": "swagger-jsdoc ...",
    "test:integration": "jest --testPathPattern=integration",
    ...
  }
}
```

**From `loan-crm-backend/`:**
- Modular service patterns
- Legal case management patterns
- Advanced collection workflows
- Legal escalation rules

### Frontend Structure
✅ **Already unified** in `/frontend/` with:
- React 18 + Vite
- TailwindCSS + custom components
- React Query for data management
- React Hook Form for form handling
- Framer Motion for animations
- Comprehensive component library
- Protected routes & auth integration
- Role-based dashboards

## 🚀 Quick Start

### Development

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Production

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Using Vercel
npm run deploy
```

## 📁 Key Directories

| Directory | Purpose | Primary Use |
|-----------|---------|-------------|
| `/backend` | Backend API | ✅ Active |
| `/frontend` | React frontend | ✅ Active |
| `/backend-new` | Reference patterns | 📚 Reference only |
| `/loan-crm-backend` | Alternative impl | 📚 Reference only |
| `/crm-ui-starter` | UI templates | 📚 Reference only |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local dev stack (MongoDB, Redis, backend, frontend, Nginx) |
| `docker-compose.prod.yml` | Production deployment stack |
| `vercel.json` | Vercel deployment config (backend + frontend) |
| `backend/package.json` | Merged v2.0 with all enterprise features |
| `frontend/package.json` | Modern React stack with all dependencies |

## 📚 Backend API Structure

```
/backend
├── controllers/
│   ├── authController.js        # Auth endpoints
│   ├── loanController.js        # Loan CRUD
│   ├── loanEngineController.js  # Loan engine operations
│   ├── paymentController.js     # Payment processing
│   └── ...
├── services/
│   ├── authService.js
│   ├── loanService.js           # Loan business logic
│   ├── paymentService.js        # Payment allocation
│   └── ...
├── models/
│   ├── User.js
│   ├── Loan.js
│   ├── Payment.js
│   └── ...
├── routes/
│   ├── authRoutes.js
│   ├── loanRoutes.js
│   └── ...
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── errorHandler.js
│   ├── validation.js
│   └── ...
├── cron/
│   ├── updateDPD.js             # DPD recalculation
│   ├── interestCalculation.js
│   └── ...
├── utils/
│   ├── scheduleGenerator.js     # EMI schedule creation
│   ├── paymentAllocator.js      # Payment allocation logic
│   └── ...
└── scripts/
    ├── seed.js                  # Database seeding
    ├── migrate-*.js             # Data migrations
    └── ...
```

## 🎨 Frontend Component Structure

```
/frontend/src
├── components/
│   ├── Dashboard/              # Dashboard features
│   ├── Layout/                 # Main layout
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── ui/                     # UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Form.jsx
│   │   └── ...
│   └── ...
├── pages/                      # Page components
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── Loans.jsx
│   ├── Collections.jsx
│   └── ...
├── services/
│   └── api.js                  # API client
├── hooks/
│   ├── useAuth.js
│   ├── useLoan.js
│   └── ...
├── context/
│   └── AuthContext.jsx
└── utils/
    ├── constants.js
    ├── helpers.js
    └── ...
```

## 🔐 Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/loan-db
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Loan Management System
```

## 📊 Architecture Benefits

### Unified Backend (v2.0)
✅ Enterprise-ready dependencies  
✅ Advanced logging (Winston)  
✅ Job queue support (Bull + Redis)  
✅ API documentation (Swagger)  
✅ File processing (PDF, Excel, Images)  
✅ SMS/Email support (Twilio, Nodemailer)  
✅ Authentication (Passport + JWT)  
✅ Enhanced security tooling  
✅ Comprehensive linting (ESLint)  
✅ Better testing setup (Supertest)  

### Modern Frontend
✅ Latest React 18  
✅ Vite for fast builds  
✅ TailwindCSS for styling  
✅ React Query for data management  
✅ Form handling (React Hook Form)  
✅ Animations (Framer Motion)  
✅ Responsive design  
✅ Dark mode ready  

## 🚀 Deployment

### Docker Compose (Local)
```bash
docker-compose up -d
```

### Docker Compose (Production)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel
```bash
# Automatically deploys from git
# Backend: backend/src/server.js
# Frontend: frontend/ (dist folder)
```

## 📝 Scripts Reference

### Backend Scripts
```bash
npm run dev                    # Start development server
npm run start                  # Start production server
npm run test                   # Run tests
npm run lint                   # Check code style
npm run lint:fix              # Fix code style
npm run build                 # Build & test
npm run seed                  # Seed database
npm run cron:dpd              # Run DPD update manually
npm run docs:generate         # Generate API docs
npm run security:audit        # Run security check
```

### Frontend Scripts
```bash
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview               # Preview production build
npm run lint                  # Check code style
npm run test                  # Run tests
npm run test:watch           # Watch mode testing
```

## 🔗 Related Documentation

- [LOAN_ENGINE_COMPLETE.md](./LOAN_ENGINE_COMPLETE.md) - Loan engine algorithms
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Deployment guide
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Security best practices
- [README.md](./README.md) - Project overview

## ✅ Merge Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Core | ✅ Merged | v1.0 + v2.0 features combined |
| Frontend | ✅ Merged | Renamed from frontend-web |
| Database | ✅ Ready | MongoDB + Redis configured |
| Docker Setup | ✅ Ready | Both dev & prod stacks |
| Documentation | ✅ Complete | All updated |
| Reference Dirs | ✅ Kept | backend-new, loan-crm-backend, crm-ui-starter |

---

**Last Updated:** December 13, 2025  
**Version:** 2.0 - Unified Architecture

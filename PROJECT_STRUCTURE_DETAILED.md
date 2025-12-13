# 📊 LOAN MANAGEMENT SYSTEM - DETAILED PROJECT STRUCTURE

**Version:** 2.0 | **Last Updated:** December 13, 2025

---

## 🏢 ROOT LEVEL DIRECTORY STRUCTURE

```
loan-management-system/
├── 🟢 PRODUCTION DIRECTORIES
│   ├── backend/                          ✅ PRIMARY BACKEND API (v2.0)
│   └── frontend/                         ✅ PRIMARY FRONTEND (React)
│
├── 🟡 REFERENCE DIRECTORIES
│   ├── backend-new/                      📚 v2.0 Alternative patterns
│   ├── loan-crm-backend/                 📚 Modular patterns
│   └── crm-ui-starter/                   📚 UI templates
│
├── 🔧 INFRASTRUCTURE
│   ├── infrastructure/                   DevOps configurations
│   ├── nginx/                            Reverse proxy config
│   ├── monitoring/                       Monitoring setup
│   └── docs/                             Documentation
│
├── 📱 FUTURE PROJECTS
│   ├── desktop-app/                      Electron desktop app
│   └── mobile-app/                       React Native app
│
├── 🔧 CONFIG FILES
│   ├── docker-compose.yml                Local dev stack
│   ├── docker-compose.prod.yml           Production stack
│   ├── vercel.json                       Vercel deployment
│   ├── package.json                      Root package
│   └── .env                              Environment variables
│
├── 📖 DOCUMENTATION FILES
│   ├── MERGE_DOCUMENTATION_INDEX.md      Navigation hub
│   ├── MERGED_PROJECT_STRUCTURE.md       Architecture guide
│   ├── MERGE_COMPLETION_REPORT.md        Merge summary
│   ├── QUICK_START_MERGED.md             Quick reference
│   ├── BEFORE_AND_AFTER.md               Comparison
│   ├── MERGE_CHECKLIST.md                Tasks checklist
│   ├── README.md                         Project overview
│   └── LOAN_ENGINE_COMPLETE.md           Loan algorithms
│
└── 📁 SUPPORT DIRECTORIES
    ├── .github/                          GitHub config
    ├── .vscode/                          VS Code settings
    ├── .qodo/                            Code analysis
    ├── scripts/                          Utility scripts
    ├── public/                           Static assets
    └── src/                              Shared source
```

---

## 🎯 PRIMARY DIRECTORIES IN DETAIL

### ✅ **1. /backend/** - PRIMARY BACKEND (v2.0 ENHANCED)

```
backend/
├── src/
│   ├── config/                    # Configuration modules
│   │   ├── database.js            # MongoDB connection
│   │   ├── redis.js               # Redis client
│   │   ├── logger.js              # Winston logging
│   │   └── environment.js         # Env variables
│   └── server.js                  # Vite/ESM entry point
│
├── controllers/                   # HTTP Request Handlers
│   ├── authController.js          # Authentication logic
│   ├── loanController.js          # Loan operations
│   ├── loanEngineController.js    # Loan engine APIs
│   ├── paymentController.js       # Payment processing
│   ├── customerController.js      # Customer management
│   ├── collectionController.js    # Collections CRM
│   ├── dashboardController.js     # Dashboard data
│   └── userController.js          # User management
│
├── services/                      # Business Logic Layer
│   ├── authService.js             # Auth business logic
│   ├── loanService.js             # Loan processing
│   ├── loanEngineService.js       # Schedule & allocation
│   ├── paymentService.js          # Payment allocation
│   ├── collectionService.js       # Collection workflows
│   ├── customerService.js         # Customer operations
│   ├── notificationService.js     # Email/SMS service
│   └── reportService.js           # Report generation
│
├── models/                        # Mongoose Schemas
│   ├── User.js                    # User model
│   ├── Loan.js                    # Loan model
│   ├── Payment.js                 # Payment model
│   ├── Customer.js                # Customer model
│   ├── Schedule.js                # EMI schedule model
│   ├── Collection.js              # Collection model
│   ├── Document.js                # Document model
│   └── Audit.js                   # Audit trail
│
├── routes/                        # API Route Definitions
│   ├── authRoutes.js              # Auth endpoints
│   ├── loanRoutes.js              # Loan endpoints
│   ├── paymentRoutes.js           # Payment endpoints
│   ├── customerRoutes.js          # Customer endpoints
│   ├── collectionRoutes.js        # Collection endpoints
│   ├── dashboardRoutes.js         # Dashboard endpoints
│   ├── reportRoutes.js            # Report endpoints
│   └── userRoutes.js              # User endpoints
│
├── middleware/                    # Express Middleware
│   ├── auth.js                    # JWT authentication
│   ├── authorize.js               # RBAC authorization
│   ├── validation.js              # Input validation
│   ├── errorHandler.js            # Global error handler
│   ├── asyncHandler.js            # Async wrapper
│   ├── rateLimiter.js             # Rate limiting
│   ├── logger.js                  # Request logging
│   ├── cors.js                    # CORS config
│   └── requestId.js               # Request tracking
│
├── utils/                         # Helper Functions
│   ├── scheduleGenerator.js       # EMI calculation
│   ├── paymentAllocator.js        # Payment distribution
│   ├── dpdCalculator.js           # DPD calculation
│   ├── validators.js              # Validation functions
│   ├── formatters.js              # Data formatting
│   ├── calculators.js             # Math utilities
│   ├── encryption.js              # Crypto utilities
│   └── dateHelpers.js             # Date utilities
│
├── cron/                          # Scheduled Jobs
│   ├── updateDPD.js               # Daily DPD update
│   ├── interestCalculation.js     # Interest accrual
│   ├── legalEscalation.js         # Legal escalation
│   ├── paymentReconciliation.js   # Payment sync
│   └── reportGeneration.js        # Daily reports
│
├── scripts/                       # Data & Setup Scripts
│   ├── seed.js                    # Database seeding
│   ├── migrate-*.js               # Data migrations
│   ├── importData.js              # CSV import
│   ├── validateMigration.js       # Migration validation
│   ├── backup.js                  # Database backup
│   └── restore.js                 # Database restore
│
├── tests/                         # Test Suite
│   ├── unit/                      # Unit tests
│   │   ├── models.test.js
│   │   ├── services.test.js
│   │   └── utils.test.js
│   ├── integration/               # Integration tests
│   │   ├── routes.test.js
│   │   ├── auth.test.js
│   │   └── loans.test.js
│   └── e2e/                       # End-to-end tests
│
├── logs/                          # Application Logs
│   ├── error.log                  # Error logs
│   ├── combined.log               # Combined logs
│   └── cron.log                   # Cron job logs
│
├── package.json                   # v2.0 Dependencies
│   # Scripts: dev, start, test, lint, build, security:audit, etc.
│   # Dependencies: 50+ (winston, bull, swagger, etc.)
│
├── .env.example                   # Environment template
├── Dockerfile                     # Docker container
├── jest.config.js                 # Jest testing config
├── server.js                      # Entry point (backwards compat)
└── vercel.json                    # Vercel config
```

**Key Backend Features:**
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose
- ✅ JWT authentication + Passport
- ✅ Redis caching
- ✅ Bull job queues
- ✅ Winston logging
- ✅ Swagger documentation
- ✅ Jest testing
- ✅ Error handling
- ✅ Rate limiting

---

### ✅ **2. /frontend/** - PRIMARY FRONTEND (REACT)

```
frontend/
├── src/
│   ├── components/                # Reusable React Components
│   │   ├── Dashboard/             # Dashboard views
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── DashboardCards.jsx # KPI cards
│   │   │   ├── DashboardCharts.jsx # Charts
│   │   │   └── DashboardTables.jsx # Tables
│   │   ├── Layout/                # Layout components
│   │   │   ├── Sidebar.jsx        # Side navigation
│   │   │   ├── Header.jsx         # Top header
│   │   │   ├── Layout.jsx         # Main layout
│   │   │   └── Footer.jsx         # Footer
│   │   ├── ui/                    # UI Component Library
│   │   │   ├── Button.jsx         # Button variants
│   │   │   ├── Card.jsx           # Card component
│   │   │   ├── Form.jsx           # Form wrapper
│   │   │   ├── Input.jsx          # Input field
│   │   │   ├── Modal.jsx          # Modal dialog
│   │   │   ├── Table.jsx          # Data table
│   │   │   ├── Tabs.jsx           # Tab navigation
│   │   │   ├── Badge.jsx          # Status badge
│   │   │   ├── Avatar.jsx         # User avatar
│   │   │   ├── Spinner.jsx        # Loading indicator
│   │   │   └── Toast.jsx          # Notifications
│   │   ├── AdvancedFilter.jsx     # Filter component
│   │   ├── AlertNotification.jsx  # Alert box
│   │   ├── FilterBar.jsx          # Search/filter bar
│   │   ├── Pagination.jsx         # Pagination control
│   │   ├── ProtectedRoute.jsx     # Auth route wrapper
│   │   ├── NotificationPanel.jsx  # Notification center
│   │   ├── SystemHealthMonitor.jsx # Health monitor
│   │   └── LazyComponents.jsx     # Code splitting
│   │
│   ├── pages/                     # Page-Level Components
│   │   ├── Login.jsx              # Login page
│   │   ├── Dashboard.jsx          # Dashboard page
│   │   ├── Customers.jsx          # Customer list
│   │   ├── CustomerDetail.jsx     # Customer detail
│   │   ├── Loans.jsx              # Loan list
│   │   ├── LoanDetail.jsx         # Loan detail
│   │   ├── Collections.jsx        # Collections page
│   │   ├── Payments.jsx           # Payment page
│   │   ├── Reports.jsx            # Reports page
│   │   ├── Users.jsx              # User management
│   │   ├── Settings.jsx           # Settings page
│   │   └── NotFound.jsx           # 404 page
│   │
│   ├── services/                  # API Service Layer
│   │   ├── api.js                 # Axios instance
│   │   ├── authService.js         # Auth API calls
│   │   ├── loanService.js         # Loan API calls
│   │   ├── paymentService.js      # Payment API calls
│   │   ├── customerService.js     # Customer API calls
│   │   ├── collectionService.js   # Collection API calls
│   │   ├── dashboardService.js    # Dashboard data
│   │   └── reportService.js       # Report data
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.js             # Auth state
│   │   ├── useFetch.js            # Fetch data
│   │   ├── useLoan.js             # Loan logic
│   │   ├── useCustomer.js         # Customer logic
│   │   ├── useForm.js             # Form handling
│   │   ├── useDebounce.js         # Debounce hook
│   │   └── useLocalStorage.js     # Local storage
│   │
│   ├── context/                   # React Context
│   │   ├── AuthContext.jsx        # Auth state
│   │   ├── UserContext.jsx        # User data
│   │   ├── NotificationContext.jsx# Notifications
│   │   └── ThemeContext.jsx       # Theme settings
│   │
│   ├── utils/                     # Helper Utilities
│   │   ├── constants.js           # App constants
│   │   ├── formatters.js          # Data formatting
│   │   ├── validators.js          # Form validation
│   │   ├── helpers.js             # Utility functions
│   │   ├── errorHandler.js        # Error handling
│   │   └── dateUtils.js           # Date utilities
│   │
│   ├── styles/                    # CSS & Styling
│   │   ├── index.css              # Global styles
│   │   ├── index-clean.css        # Clean styles
│   │   ├── App.css                # App styles
│   │   └── tailwind.css           # Tailwind import
│   │
│   ├── lib/                       # Third-party Configs
│   │   ├── axios.js               # Axios setup
│   │   ├── react-query.js         # Query client
│   │   └── dayjs.js               # Date library
│   │
│   ├── App.jsx                    # Root component
│   ├── App-*.jsx                  # Alternate versions
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Main styles
│
├── public/                        # Static Assets
│   ├── images/                    # Images
│   ├── icons/                     # Icons
│   └── favicon.ico                # Favicon
│
├── package.json                   # Dependencies
│   # Scripts: dev, build, lint, test, etc.
│   # Dependencies: React, Vite, TailwindCSS, React Query, etc.
│
├── vite.config.js                 # Vite build config
├── tailwind.config.js             # TailwindCSS config
├── postcss.config.cjs             # PostCSS config
├── tsconfig.json                  # TypeScript config
├── index.html                     # HTML template
├── .env.example                   # Environment template
├── Dockerfile                     # Docker container
└── nginx.conf                     # Nginx reverse proxy
```

**Key Frontend Features:**
- ✅ React 18 with Hooks
- ✅ Vite build tool
- ✅ TailwindCSS styling
- ✅ React Query data management
- ✅ React Router navigation
- ✅ React Hook Form forms
- ✅ Framer Motion animations
- ✅ Axios HTTP client
- ✅ ESLint code quality
- ✅ Vitest testing

---

## 📚 REFERENCE DIRECTORIES

### **3. /backend-new/** - Alternative Backend v2.0

```
backend-new/
├── src/
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Server entry
│   ├── config/                    # Configuration
│   ├── core/                      # Base classes
│   ├── middleware/                # Middleware
│   ├── modules/                   # Feature modules
│   ├── utils/                     # Utilities
│   ├── jobs/                      # Background jobs
│   ├── validators/                # Validation schemas
│   └── routes/                    # Route definitions
├── docs/                          # Documentation
├── scripts/                       # Utility scripts
├── tests/                         # Test suite
├── package.json                   # v2.0 config
├── Dockerfile                     # Container
└── README.md                      # Docs
```

**Purpose:** Reference implementation with alternative modular patterns

---

### **4. /loan-crm-backend/** - Alternative Modular Backend

```
loan-crm-backend/
├── src/
│   ├── app.js                     # Express app
│   ├── server.js                  # Entry point
│   ├── config/                    # Config modules
│   ├── controllers/               # HTTP handlers
│   ├── cron/                      # Scheduled jobs
│   ├── middleware/                # Middleware
│   ├── models/                    # Data models
│   ├── routes/                    # API routes
│   ├── utils/                     # Utilities
│   ├── swagger.json               # API docs
│   └── services/                  # Business logic
├── logs/                          # Application logs
├── package.json                   # Dependencies
├── .env                           # Environment
├── Dockerfile                     # Container
└── README.md                      # Documentation
```

**Purpose:** Alternative modular architecture for reference

---

### **5. /crm-ui-starter/** - UI Starter Template

```
crm-ui-starter/
├── src/
│   ├── components/                # UI components
│   ├── pages/                     # Page components
│   ├── styles/                    # Styling
│   ├── App.jsx                    # Root component
│   └── main.jsx                   # Entry
├── public/                        # Static files
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite config
├── tsconfig.json                  # TypeScript config
├── tailwind.config.cjs            # Tailwind config
└── index.html                     # HTML template
```

**Purpose:** UI component templates and patterns

---

## 🔧 INFRASTRUCTURE DIRECTORIES

### **6. /infrastructure/** - DevOps Configuration

```
infrastructure/
├── terraform/                     # IaC (Infrastructure as Code)
├── kubernetes/                    # K8s manifests
├── ansible/                       # Configuration management
└── scripts/                       # Setup scripts
```

---

### **7. /nginx/** - Reverse Proxy

```
nginx/
├── nginx.conf                     # Main config
├── conf.d/                        # Config snippets
├── ssl/                           # SSL certificates
└── README.md                      # Documentation
```

---

### **8. /monitoring/** - Monitoring Setup

```
monitoring/
├── prometheus.yml                 # Prometheus config
├── grafana/                       # Grafana dashboards
├── alert-rules.yml                # Alert rules
└── docker-compose.yml             # Stack setup
```

---

### **9. /docs/** - Documentation

```
docs/
├── api/                           # API documentation
│   ├── swagger.json               # Swagger/OpenAPI
│   ├── auth.md                    # Auth docs
│   ├── loans.md                   # Loan APIs
│   └── payments.md                # Payment APIs
├── architecture-diagrams/         # System architecture
├── data-model/                    # Data schema
├── flows/                         # Business flows
└── setup/                         # Setup guides
```

---

## 📱 FUTURE PROJECT DIRECTORIES

### **10. /desktop-app/** - Electron App

```
desktop-app/
├── src/
│   ├── main/                      # Main process
│   ├── renderer/                  # UI process
│   └── shared/                    # Shared code
├── build/                         # Build output
├── dist/                          # Distribution
└── package.json                   # Dependencies
```

---

### **11. /mobile-app/** - React Native App

```
mobile-app/
├── src/
│   ├── screens/                   # App screens
│   ├── components/                # Components
│   ├── services/                  # API services
│   └── navigation/                # Navigation
├── ios/                           # iOS native
├── android/                       # Android native
└── package.json                   # Dependencies
```

---

## 🔧 CONFIGURATION FILES (ROOT)

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local dev stack (MongoDB, Redis, API, UI, Nginx) |
| `docker-compose.prod.yml` | Production deployment stack |
| `vercel.json` | Vercel serverless deployment config |
| `package.json` | Root package (scripts, workspaces) |
| `.env.example` | Environment variable template |
| `.gitignore` | Git ignore rules |
| `.vercelignore` | Vercel ignore rules |

---

## 📚 DOCUMENTATION FILES (ROOT)

| File | Purpose |
|------|---------|
| `MERGE_DOCUMENTATION_INDEX.md` | Navigation hub |
| `MERGED_PROJECT_STRUCTURE.md` | Architecture guide |
| `MERGE_COMPLETION_REPORT.md` | Merge summary |
| `QUICK_START_MERGED.md` | Quick reference |
| `BEFORE_AND_AFTER.md` | Comparison |
| `MERGE_CHECKLIST.md` | Tasks checklist |
| `README.md` | Project overview |
| `LOAN_ENGINE_COMPLETE.md` | Loan algorithms |

---

## 📊 DEPENDENCY STRUCTURE

### **Backend Dependencies (50+)**

```
Core Framework
├── express
├── mongoose
├── cors
└── helmet

Authentication
├── jsonwebtoken
├── bcryptjs
├── passport
├── passport-jwt
└── passport-local

Data & Caching
├── redis
├── ioredis
├── bull
└── compression

Logging & Monitoring
├── winston
├── morgan
└── dotenv

File Processing
├── multer
├── sharp
├── pdf-lib
├── pdfkit
├── xlsx
└── csv-parser

Communication
├── nodemailer
├── twilio
└── axios

API & Validation
├── express-validator
├── joi
├── swagger-jsdoc
└── swagger-ui-express

Scheduling
├── node-cron
└── date-fns

Development
├── eslint
├── prettier
├── jest
├── supertest
└── nodemon
```

### **Frontend Dependencies (30+)**

```
Core Framework
├── react
├── react-dom
└── react-router-dom

State Management
├── @tanstack/react-query
└── zustand (optional)

Forms & Validation
├── react-hook-form
├── yup
└── formik

UI & Styling
├── tailwindcss
├── lucide-react
├── heroicons
├── framer-motion
└── class-variance-authority

HTTP Client
├── axios
└── @tanstack/react-query

Date & Time
├── date-fns
└── dayjs

Development
├── vite
├── eslint
├── vitest
└── @testing-library/react
```

---

## 🔌 PORT ALLOCATION

| Service | Port | Environment |
|---------|------|-------------|
| Frontend | 5173 | Development |
| Backend API | 5000 | Development |
| MongoDB | 27017 | Local |
| Redis | 6379 | Local |
| Nginx | 80, 443 | Production |

---

## 🗂️ FILE ORGANIZATION SUMMARY

```
Total Directories: 20+
├── Production: 2 (backend, frontend)
├── Reference: 3 (backend-new, loan-crm-backend, crm-ui-starter)
├── Infrastructure: 5 (infrastructure, nginx, monitoring, docs, scripts)
├── Future: 2 (desktop-app, mobile-app)
└── Support: 8+ (config, github, vscode, etc.)

Total Configuration Files: 20+
├── Docker: 2 (docker-compose.yml, docker-compose.prod.yml)
├── Deployment: 1 (vercel.json)
├── Documentation: 8 (merge guides)
├── Environment: 2 (.env, .env.example)
└── Other: 7+ (.gitignore, .vercelignore, etc.)

Total Documentation Files: 10+
├── Setup & Quickstart: 3
├── Architecture: 1
├── Merge Details: 3
├── Reference: 3
└── Business Logic: 1
```

---

## 🎯 DIRECTORY USAGE GUIDE

### **For Development**
```
USE:
  /backend/        - Backend API development
  /frontend/       - Frontend development
  
REFERENCE:
  /backend-new/   - Learn patterns
  /docs/          - API documentation
```

### **For Deployment**
```
USE:
  docker-compose.yml          - Local testing
  docker-compose.prod.yml     - Production
  vercel.json                 - Cloud deployment
```

### **For Learning**
```
READ:
  MERGED_PROJECT_STRUCTURE.md - Architecture
  QUICK_START_MERGED.md       - Quick ref
  LOAN_ENGINE_COMPLETE.md     - Business logic
```

---

## ✅ DIRECTORY CHECKLIST

- [x] Backend v2.0 with enterprise features
- [x] Frontend React with Vite
- [x] Docker production-ready
- [x] Documentation complete
- [x] Reference implementations preserved
- [x] Infrastructure configured
- [x] Deployment ready

---

**Last Updated:** December 13, 2025  
**Version:** 2.0 Unified Architecture

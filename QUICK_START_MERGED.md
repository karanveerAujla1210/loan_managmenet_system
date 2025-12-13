# 🚀 Quick Start Guide - Merged Project

## What's Done ✅

Your project has been successfully **merged and unified**:

- ✅ **Backend** (`/backend/`) - Enhanced to v2.0 with enterprise features
- ✅ **Frontend** (`/frontend/`) - Modern React stack, renamed from frontend-web
- ✅ **Docker** - Configured for both dev and production
- ✅ **Documentation** - Complete guides created

---

## 📂 Directory Map

```
PRIMARY PRODUCTION DIRECTORIES:
├── /backend/       ← Use this for API development
└── /frontend/      ← Use this for UI development

REFERENCE DIRECTORIES (for patterns only):
├── /backend-new/        - Keep for advanced patterns
├── /loan-crm-backend/   - Keep for alternative patterns
└── /crm-ui-starter/     - Keep for UI template reference
```

---

## 🎯 Common Tasks

### Start Development

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm install    # only first time
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm install    # only first time
npm run dev
```

### Build for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Run with Docker (Production)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Useful Backend Commands

```bash
npm run dev              # Start development
npm run test             # Run tests
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm run build            # Build and test
npm run docs:generate    # Create API docs
npm run security:audit   # Check for vulnerabilities
npm run cron:dpd         # Run DPD calculation
npm run seed             # Seed database
```

---

## 🎨 Useful Frontend Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Check code style
npm run test             # Run tests
```

---

## 📋 Backend Features Available Now

| Feature | Command |
|---------|---------|
| Code Linting | `npm run lint` |
| API Docs | `npm run docs:generate` |
| Security Check | `npm run security:audit` |
| DPD Updates | `npm run cron:dpd` |
| DB Seeding | `npm run seed` |
| Run Tests | `npm run test` |

---

## 🌐 Access Points

Once running locally:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs (after generating)

---

## 📖 Documentation

Read these for more details:

1. **[MERGED_PROJECT_STRUCTURE.md](./MERGED_PROJECT_STRUCTURE.md)** - Complete architecture
2. **[LOAN_ENGINE_COMPLETE.md](./LOAN_ENGINE_COMPLETE.md)** - How the loan engine works
3. **[README.md](./README.md)** - Project overview
4. **[MERGE_COMPLETION_REPORT.md](./MERGE_COMPLETION_REPORT.md)** - What was merged

---

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Clear node_modules and reinstall
rm -r backend/node_modules backend/package-lock.json
cd backend && npm install && npm run dev
```

### Frontend build fails?
```bash
# Clear cache and rebuild
rm -r frontend/node_modules frontend/package-lock.json
cd frontend && npm install && npm run build
```

### Port already in use?
```bash
# Change backend port in backend/.env
# Change frontend port with:
npm run dev -- --port 3000
```

---

## 📞 What Each Directory Does

### `/backend` (USE THIS)
- REST API server
- Database models & queries
- Business logic
- Payment processing
- Collections management
- Loan engine

### `/frontend` (USE THIS)
- React user interface
- Dashboard & analytics
- Forms & data input
- Collections view
- Customer portal

### `/backend-new` (REFERENCE ONLY)
- Alternative backend patterns
- Use to learn modular structure
- Check for advanced examples
- **Don't edit or use directly**

### `/loan-crm-backend` (REFERENCE ONLY)
- Alternative modular approach
- Legal case management patterns
- Use for reference
- **Don't edit or use directly**

### `/crm-ui-starter` (REFERENCE ONLY)
- UI starter templates
- Component examples
- Design patterns
- **Don't edit or use directly**

---

## ✨ New Backend Features (v2.0)

Enhanced backend now includes:

- 📝 Advanced logging (Winston)
- 📅 Job queues (Bull + Redis)
- 📄 Document generation (PDF, Excel)
- 📧 Email & SMS (Nodemailer, Twilio)
- 🔐 Enhanced auth (Passport + JWT)
- 📊 API documentation (Swagger)
- ✅ Advanced testing (Supertest)
- 🎯 Code quality (ESLint + Prettier)
- 🛡️ Security tools (Snyk audit)

---

## 🚀 Deployment

### Local Docker
```bash
docker-compose up -d
```

### Production Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel (Cloud)
```bash
# Push to git - auto-deploys
git push origin main
```

---

## 📝 Environment Setup

### Backend `.env`
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/loan-db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Loan Management System
```

---

## ✅ Checklist for First Run

- [ ] Clone/navigate to project
- [ ] Read `MERGED_PROJECT_STRUCTURE.md`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Visit http://localhost:5173
- [ ] Test login functionality
- [ ] Check console for any errors
- [ ] Run `npm run lint` to check code
- [ ] Run `npm run test` to verify tests

---

## 🎉 You're Ready!

Everything is merged and ready to use. Start with:

```bash
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

Then visit **http://localhost:5173** to access the application.

---

**Need more help?**  
→ See [MERGED_PROJECT_STRUCTURE.md](./MERGED_PROJECT_STRUCTURE.md)  
→ See [MERGE_COMPLETION_REPORT.md](./MERGE_COMPLETION_REPORT.md)

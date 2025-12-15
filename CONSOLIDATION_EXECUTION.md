# Backend & Frontend Consolidation - Execution Plan

## Current State
- **Backend**: 2 folders (backend/, backend-new/)
- **Frontend**: 2 folders (frontend/, crm-ui-starter/)
- **Root**: 50+ markdown files, 10+ empty directories

## Target State
- **Backend**: Single `backend/` folder (merged)
- **Frontend**: Single `frontend/` folder (merged)
- **Root**: Clean structure with 8 core docs only

---

## STEP 1: Backup Current State
```bash
# Create backup
mkdir backups
xcopy backend backups\backend-backup /E /I
xcopy backend-new backups\backend-new-backup /E /I
xcopy frontend backups\frontend-backup /E /I
xcopy crm-ui-starter backups\crm-ui-starter-backup /E /I
```

---

## STEP 2: Merge Backend (backend-new → backend)

### 2.1 Copy backend-new/src/* → backend/src/
```bash
# backend-new has cleaner structure, copy its modules
xcopy backend-new\src\modules backend\src\modules /E /I /Y
xcopy backend-new\src\core backend\src\core /E /I /Y
xcopy backend-new\src\jobs backend\src\jobs /E /I /Y
```

### 2.2 Merge package.json
- Keep backend/package.json as base
- Add any missing dependencies from backend-new/package.json
- Update scripts section

### 2.3 Merge .env files
- Keep backend/.env
- Add any missing vars from backend-new/.env.example

### 2.4 Delete backend-new/
```bash
rmdir /S /Q backend-new
```

---

## STEP 3: Merge Frontend (crm-ui-starter → frontend)

### 3.1 Copy crm-ui-starter/src/* → frontend/src/
```bash
# Merge styles and components
xcopy crm-ui-starter\src\styles frontend\src\styles /E /I /Y
```

### 3.2 Delete crm-ui-starter/
```bash
rmdir /S /Q crm-ui-starter
```

---

## STEP 4: Clean Root Directory

### 4.1 Delete Empty Directories
```bash
rmdir /S /Q -p
rmdir /S /Q .qodo
rmdir /S /Q desktop-app
rmdir /S /Q mobile-app
rmdir /S /Q infrastructure
rmdir /S /Q monitoring
rmdir /S /Q nginx
```

### 4.2 Delete Duplicate Markdown Files (Keep only 8 core docs)

**KEEP:**
- README.md
- PRODUCTION_DEPLOYMENT.md
- SECURITY_CHECKLIST.md
- IMPLEMENTATION_GUIDE.md
- OPERATIONAL_WORKFLOWS.md
- QUICK_START_MERGED.md
- DEPLOYMENT_CHECKLIST.md
- PROJECT_CONSOLIDATION_PLAN.md

**DELETE:** (40+ files)
- All other .md files in root

### 4.3 Delete Duplicate Config Files
```bash
del .env.production
del .vercelignore
del .dockerignore
```

### 4.4 Delete Data Files (Move to data/ folder)
```bash
mkdir data
move *.json data\
move *.xlsx data\
```

### 4.5 Delete Duplicate Scripts
```bash
del import-data.bat
del import-data.sh
del open-in-vscode.bat
del setup-cron.bat
del start-dev.bat
del fix-security.ps1
del split-json-and-import.js
```

---

## STEP 5: Organize Root Structure

```
loan-management-system/
├── backend/                    # Merged backend
├── frontend/                   # Merged frontend
├── docs/                       # Documentation
├── data/                       # Sample data files
├── scripts/                    # Deployment scripts
├── .github/                    # GitHub workflows
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
├── .gitignore
├── package.json
├── README.md
├── PRODUCTION_DEPLOYMENT.md
├── SECURITY_CHECKLIST.md
├── IMPLEMENTATION_GUIDE.md
├── OPERATIONAL_WORKFLOWS.md
├── QUICK_START_MERGED.md
├── DEPLOYMENT_CHECKLIST.md
└── PROJECT_CONSOLIDATION_PLAN.md
```

---

## STEP 6: Update Root package.json

```json
{
  "name": "business-loan-crm",
  "version": "1.0.0",
  "description": "Post-disbursement Business Loan Collections CRM",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "npm run start:backend",
    "start:backend": "cd backend && npm start",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  },
  "workspaces": ["backend", "frontend"]
}
```

---

## STEP 7: Verify Consolidation

- [ ] backend/ contains all merged code
- [ ] frontend/ contains all merged code
- [ ] backend-new/ deleted
- [ ] crm-ui-starter/ deleted
- [ ] Empty directories deleted
- [ ] Root has only 8 core markdown files
- [ ] data/ folder created with sample files
- [ ] Root package.json updated
- [ ] All .env files consolidated
- [ ] Docker files in root

---

## Expected Results

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| Total Files | 100+ | ~35 | 65% |
| Root Markdown | 50+ | 8 | 84% |
| Backend Folders | 2 | 1 | 50% |
| Frontend Folders | 2 | 1 | 50% |
| Empty Directories | 10 | 0 | 100% |

---

## Rollback Plan

If issues occur:
```bash
rmdir /S /Q backend
rmdir /S /Q frontend
xcopy backups\backend-backup backend /E /I
xcopy backups\frontend-backup frontend /E /I
```

---

## Timeline
- Backup: 2 min
- Merge Backend: 5 min
- Merge Frontend: 3 min
- Clean Root: 5 min
- Verify: 5 min
- **Total: ~20 minutes**

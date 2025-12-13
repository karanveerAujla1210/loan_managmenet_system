```markdown
# Repo-specific Copilot instructions — Loan Management System

Purpose: make AI coding agents productive quickly by documenting architecture, workflows, and concrete examples found in this repository.

Key files (start here):
- `backend/src/server.js` — backend entry, connects DB and mounts routes.
- `backend/package.json` — dev/prod scripts (see `dev`, `import-data`, `cron:dpd`).
- `backend/controllers/*`, `backend/services/*`, `backend/models/*` — controller → service → model separation.
- `backend/middleware/*` — common middleware patterns (see `asyncHandler.js`, `auth.js`, `error.js`).
- `docker-compose.yml` & `docker-compose.prod.yml` — local production-like stack (mongodb, redis, backend, frontend, nginx).
- `split-json-and-import.js`, `import-data.sh`/`import-data.bat` — how data is imported into MongoDB.
- `LOAN_ENGINE_COMPLETE.md` — concise description of core engines (schedule, allocation, DPD, linking).

How to run (developer shortcuts):
- Start backend in dev:

```bash
cd backend
npm install
npm run dev
```

- Import sample data (creates `*.json` then mongoimport):

```bash
node split-json-and-import.js
./import-data.sh   # or import-data.bat on Windows
```

- Run DPD cron manually:

```bash
cd backend
npm run cron:dpd
```

Patterns & conventions (explicit examples):
- Controllers are thin and call business `services` (see `backend/controllers/loanController.js` calling `loanService`).
- Use `asyncHandler` wrapper for async routes — prefer `middleware/asyncHandler.js` to bubble errors to `errorHandler`.
- Authorization middleware attaches `req.user` (see `middleware/auth.js`) and exposes `authorize(...)` helper.
- Models use Mongoose with descriptive schemas (example `backend/models/Loan.js` uses `installmentFrequency`, `dpd`, `bucket`).
- Cron and background jobs live under `backend/cron` and are invoked via npm scripts (`cron:dpd`), or run standalone scripts in `backend/scripts`.

Integration points & environment:
- MongoDB is required (see `docker-compose.yml` service `mongodb`). DB connect happens in `src/config/database` (imported by `server.js`).
- Redis used for caching in compose (`redis` service); check `backend/utils` / `middleware/caching.js` for usage.
- Vercel deployment configured in `vercel.json` — backend expected at `backend/src/server.js` when deploying serverless.
- Environment variables are used across `backend` (`.env`) — don't hardcode secrets; follow existing `.env.example` patterns in `backend`.

Testing & CI:
- Tests use Jest (see `backend/package.json` `test` scripts). Run with `cd backend && npm test`.
- Many repo docs reference CI steps; prefer running unit tests locally before opening PRs.

What the AI should do (examples of safe, actionable tasks):
- Add a new route: create controller → service → route file, wrap controller functions with `asyncHandler`, add tests under `backend/tests`.
- Add validation: follow `express-validator` patterns already used; prefer centralized validation middleware in `middleware/validation.js`.
- Update schedule/payment logic: refer to `LOAN_ENGINE_COMPLETE.md` and `backend/services/loanService.js`, `backend/utils/scheduleGenerator.js`, `paymentAllocator.js` for algorithm shape and unit tests.

What to avoid or verify before changes:
- Do not change DB schema names without updating import scripts and `split-json-and-import.js`.
- When modifying startup scripts, update `backend/package.json` and `docker-compose.yml` consistently.

Where to look for examples:
- Full engine examples: `LOAN_ENGINE_COMPLETE.md` and `backend/scripts/testLoanEngine.js` (test harness).
- Data import: `split-json-and-import.js`, `import-data.sh`, `import-data.bat`.
- Error and logging pattern: `backend/middleware/error.js`, `backend/middleware/logger.js`, and `backend/server.js` logging setup.

If unsure, ask the repo owner for env values or confirm behavior before changing migrations or seed scripts.

---
Please review these additions and tell me which sections need more detail or specific examples to include.
```
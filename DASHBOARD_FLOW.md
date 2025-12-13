# Dashboard Flow and API Mapping

Overview
- Frontend: `frontend-web` React + Tailwind + Recharts
- Backend: `backend` Node.js + Express + MongoDB (Mongoose)
- Auth: JWT (cookie or Authorization header)

API → Frontend mapping
- `GET /api/dashboard/metrics` → `DashboardService.getMetrics()` → Top cards
- `GET /api/dashboard/loan-performance` → `getLoanPerformance()` → LoanPerformanceChart
- `GET /api/dashboard/collections-trend` → `getCollectionsTrend()` → CollectionsTrendChart
- `GET /api/dashboard/dpd-buckets` → `getDpdBuckets()` → DpdBucketsChart
- `GET /api/dashboard/leads-stats` → `getLeadsStats()` → LeadsChart
- `GET /api/dashboard/recent-customers` → `getRecentCustomers()` → Recent Customers table
- `GET /api/dashboard/recent-loans` → `getRecentLoans()` → Recent Loans table
- `GET /api/dashboard/today-collections` → `getTodayCollections()` → Today's Collections table
- `GET /api/dashboard/pending-approvals` → `getPendingApprovals()` → Pending approvals panel
- `GET /api/v1/auth/me` → `DashboardService.getMe()` → user info + role

Dashboard architecture
- `frontend-web/src/pages/Dashboard.jsx` orchestrates data loads, polls every 60s, and passes data to UI components.
- `frontend-web/src/services/DashboardService.js` wraps API calls using `frontend-web/src/utils/axiosInstance.js` which injects JWT tokens.
- Backend endpoints implemented in `backend/controllers/dashboardController.js` and mounted at `backend/routes/apiDashboard.js`.

Role-based UI behavior
- Role mapping (frontend):
  - `agent` → treated as `counsellor`
  - `admin` → treated as `manager`
  - other roles will have limited visibility
- Visibility rules:
  - Counsellor: Leads + Customers widgets
  - Advisor: Leads + Loan Applications widgets
  - Manager: full dashboard + branch/pending approvals

Data flow and refresh
- On mount, Dashboard loads all datasets concurrently and renders cards, charts and tables.
- A background refresh runs every 60 seconds to pull fresh metrics and charts.

Backend aggregation notes
- Aggregations use Mongoose pipelines: date grouping via `$dateToString`, bucket grouping, and sum/avg groups for KPIs.

How to run locally
1. Backend
   - cd backend
   - npm install
   - set `.env` variables (MONGO_URI, JWT_SECRET, CLIENT_URL)
   - npm run dev

2. Frontend
   - cd frontend-web
   - npm install
   - npm run dev

Notes
- The dashboard endpoints are mounted at `/api/dashboard/*` and are protected by the existing `auth` middleware.
- Tokens are expected in `Authorization: Bearer <token>` or in `token` cookie depending on login flow.

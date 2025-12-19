# MIS Reports System - Flow Diagrams & Architecture

## 1. Current Broken Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│              MISReports/index.jsx                               │
│                                                                 │
│  const fetchReports = async () => {                             │
│    const [pRes, bRes, eRes, ...] = await Promise.all([          │
│      fetch('/api/v1/reports/portfolio'),                        │
│      fetch('/api/v1/reports/buckets'),                          │
│      fetch('/api/v1/reports/efficiency'),                       │
│      ...                                                        │
│    ])                                                           │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP GET
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│                                                                 │
│  app.js / app-production.js                                     │
│                                                                 │
│  ❌ MISSING:                                                    │
│  app.use('/api/v1/reports', reportsRoutes)                      │
│                                                                 │
│  Result: 404 Not Found                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ 404 Response
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│                                                                 │
│  catch (error) {                                                │
│    toast.error('Failed to load reports')                        │
│  }                                                              │
│                                                                 │
│  Result: Empty data state displayed                             │
│  {                                                              │
│    portfolio: null,                                             │
│    buckets: [],                                                 │
│    efficiency: null,                                            │
│    legal: null,                                                 │
│    collectors: [],                                              │
│    aging: []                                                    │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Expected Working Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│              MISReports/index.jsx                                │
│                                                                  │
│  fetchReports() → fetch('/api/v1/reports/portfolio')             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ GET /api/v1/reports/portfolio
                         │ Headers: Authorization: Bearer <token>
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                             │
│                                                                  │
│  app.js                                                          │
│  ✅ app.use('/api/v1/reports', protect, reportsRoutes)           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                                    │
│                                                                  │
│  1. protect (auth.middleware.js)                                │
│     - Verify JWT token                                          │
│     - Extract user info                                         │
│                                                                  │
│  2. authorize('admin', 'manager')                               │
│     - Check user role                                           │
│     - Allow only admin/manager                                  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    ROUTE HANDLER                                 │
│                                                                  │
│  reports.routes.js                                              │
│  router.get('/portfolio', async (req, res) => {                 │
│    const data = await getPortfolioSnapshot()                    │
│    res.json({ success: true, data })                            │
│  })                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    CONTROLLER                                    │
│                                                                  │
│  reports.controller.js                                          │
│  getPortfolio() → getPortfolioSnapshot()                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│                                                                  │
│  reports.service.js                                             │
│  getPortfolioSnapshot() {                                       │
│    return Loan.aggregate([                                      │
│      { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },    │
│      { $group: {                                                │
│          _id: null,                                             │
│          totalLoans: { $sum: 1 },                               │
│          totalPrincipal: { $sum: '$principal' },                │
│          totalOutstanding: { $sum: '$outstandingAmount' }       │
│        }                                                        │
│      }                                                          │
│    ])                                                           │
│  }                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
│                                                                  │
│  Loan Collection                                                │
│  - Query: Find all ACTIVE/CLOSED loans                          │
│  - Aggregate: Group by null, sum fields                         │
│  - Return: {totalLoans, totalPrincipal, totalOutstanding}       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Result
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│                                                                  │
│  Return: {                                                      │
│    totalLoans: 1250,                                            │
│    totalPrincipal: 50000000,                                    │
│    totalOutstanding: 12500000,                                  │
│    totalInterest: 2500000                                       │
│  }                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    ROUTE HANDLER                                 │
│                                                                  │
│  res.json({                                                     │
│    success: true,                                               │
│    data: {...},                                                 │
│    meta: { timestamp: "2024-01-15T10:30:00Z" }                  │
│  })                                                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ HTTP 200 + JSON
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                                                                  │
│  setData({                                                      │
│    portfolio: {                                                 │
│      totalLoans: 1250,                                          │
│      totalPrincipal: 50000000,                                  │
│      totalOutstanding: 12500000                                 │
│    },                                                           │
│    ...                                                          │
│  })                                                             │
│                                                                 │
│  Render: Portfolio cards with metrics                           │
└──────────────────────────────────────────────────────────────────┘
```

## 3. Bucket Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOAN RECORD                                  │
│                                                                 │
│  {                                                              │
│    _id: "507f1f77bcf86cd799439011",                             │
│    loanId: "LN000001",                                          │
│    principal: 100000,                                           │
│    dpd: 45,              ← Days Past Due                        │
│    status: "ACTIVE",                                            │
│    outstandingAmount: 45000,                                    │
│    schedule: [...]                                              │
│  }                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BUCKET ASSIGNMENT LOGIC                      │
│                                                                 │
│  if (dpd <= 0)      → bucket = 'CURRENT'                        │
│  if (dpd <= 7)      → bucket = 'X'                              │
│  if (dpd <= 30)     → bucket = 'Y'                              │
│  if (dpd <= 60)     → bucket = 'M1'                             │
│  if (dpd <= 90)     → bucket = 'M2'                             │
│  if (dpd <= 180)    → bucket = 'M3'                             │
│  if (dpd > 180)     → bucket = 'NPA'                            │
│                                                                 │
│  For this loan: dpd = 45 → bucket = 'M1'                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AGGREGATION RESULT                           │
│                                                                 │
│  {                                                              │
│    _id: 'M1',                                                   │
│    loanCount: 80,                                               │
│    outstandingAmount: 1200000,                                  │
│    avgDPD: 45.5                                                 │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Aging Analysis Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOAN RECORD                                  │
│                                                                 │
│  {                                                              │
│    _id: "507f1f77bcf86cd799439011",                             │
│    loanId: "LN000001",                                          │
│    disbursementDate: "2023-12-01",  ← Key field                │
│    principal: 100000,                                           │
│    outstandingAmount: 45000,                                    │
│    status: "ACTIVE"                                             │
│  }                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AGE CALCULATION                              │
│                                                                 │
│  Today: 2024-01-15                                              │
│  Disbursement: 2023-12-01                                       │
│  Age in days: 45 days                                           │
│                                                                 │
│  if (age <= 30)     → period = '0-30 days'                      │
│  if (age <= 60)     → period = '31-60 days'                     │
│  if (age <= 90)     → period = '61-90 days'                     │
│  if (age > 90)      → period = '90+ days'                       │
│                                                                 │
│  For this loan: age = 45 → period = '31-60 days'               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AGGREGATION RESULT                           │
│                                                                 │
│  {                                                              │
│    period: '31-60 days',                                        │
│    loanCount: 300,                                              │
│    outstandingAmount: 2000000                                   │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Data Collection Efficiency Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSTALLMENT RECORDS                          │
│                                                                 │
│  Installment 1:                                                 │
│  {                                                              │
│    dueDate: "2024-01-10",                                       │
│    principalDue: 10000,                                         │
│    interestDue: 1000,                                           │
│    penaltyDue: 500,                                             │
│    paidPrincipal: 10000,                                        │
│    paidInterest: 1000,                                          │
│    paidPenalty: 500,                                            │
│    status: 'PAID'                                               │
│  }                                                              │
│                                                                 │
│  Installment 2:                                                 │
│  {                                                              │
│    dueDate: "2024-02-10",                                       │
│    principalDue: 10000,                                         │
│    interestDue: 1000,                                           │
│    penaltyDue: 0,                                               │
│    paidPrincipal: 5000,                                         │
│    paidInterest: 500,                                           │
│    paidPenalty: 0,                                              │
│    status: 'PARTIAL'                                            │
│  }                                                              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CALCULATION                                  │
│                                                                 │
│  Total Due:                                                     │
│  = (10000 + 1000 + 500) + (10000 + 1000 + 0)                   │
│  = 11500 + 11000                                                │
│  = 22500                                                        │
│                                                                 │
│  Total Collected:                                               │
│  = (10000 + 1000 + 500) + (5000 + 500 + 0)                     │
│  = 11500 + 5500                                                 │
│  = 17000                                                        │
│                                                                 │
│  Efficiency:                                                    │
│  = (17000 / 22500) × 100                                        │
│  = 75.56%                                                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESULT                                       │
│                                                                 │
│  {                                                              │
│    dueAmount: 22500,                                            │
│    collectedAmount: 17000,                                      │
│    efficiency: 75.56                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Complete Request-Response Cycle

```
REQUEST:
┌──────────────────────────────────────────────────────────────────┐
│ GET /api/v1/reports/buckets                                      │
│ Headers:                                                         │
│   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│   Content-Type: application/json                                │
│                                                                  │
│ Query Parameters:                                                │
│   (none)                                                         │
└──────────────────────────────────────────────────────────────────┘

PROCESSING:
┌──────────────────────────────────────────────────────────────────┐
│ 1. Middleware: protect                                           │
│    ✓ Token verified                                              │
│    ✓ User authenticated                                          │
│                                                                  │
│ 2. Middleware: authorize('admin', 'manager')                    │
│    ✓ User role is 'admin'                                        │
│    ✓ Authorization passed                                        │
│                                                                  │
│ 3. Route Handler: GET /buckets                                  │
│    ✓ Call getBucketExposure()                                    │
│                                                                  │
│ 4. Service: getBucketExposure()                                 │
│    ✓ Query Loan collection                                       │
│    ✓ Calculate DPD for each loan                                 │
│    ✓ Assign bucket based on DPD                                  │
│    ✓ Group by bucket                                             │
│    ✓ Sum loan count and outstanding amount                       │
│                                                                  │
│ 5. Database: MongoDB Aggregation                                │
│    ✓ Match: status = 'ACTIVE'                                    │
│    ✓ AddFields: Calculate bucket from DPD                        │
│    ✓ Group: By bucket, sum counts and amounts                    │
│    ✓ Sort: By bucket name                                        │
└──────────────────────────────────────────────────────────────────┘

RESPONSE:
┌──────────────────────────────────────────────────────────────────┐
│ HTTP 200 OK                                                      │
│ Content-Type: application/json                                   │
│                                                                  │
│ {                                                                │
│   "success": true,                                               │
│   "data": [                                                      │
│     {                                                            │
│       "_id": "CURRENT",                                          │
│       "loanCount": 800,                                          │
│       "outstandingAmount": 5000000                               │
│     },                                                           │
│     {                                                            │
│       "_id": "X",                                                │
│       "loanCount": 150,                                          │
│       "outstandingAmount": 2000000                               │
│     },                                                           │
│     {                                                            │
│       "_id": "Y",                                                │
│       "loanCount": 100,                                          │
│       "outstandingAmount": 1500000                               │
│     },                                                           │
│     {                                                            │
│       "_id": "M1",                                               │
│       "loanCount": 80,                                           │
│       "outstandingAmount": 1200000                               │
│     },                                                           │
│     {                                                            │
│       "_id": "M2",                                               │
│       "loanCount": 60,                                           │
│       "outstandingAmount": 1000000                               │
│     },                                                           │
│     {                                                            │
│       "_id": "M3",                                               │
│       "loanCount": 40,                                           │
│       "outstandingAmount": 800000                                │
│     },                                                           │
│     {                                                            │
│       "_id": "NPA",                                              │
│       "loanCount": 20,                                           │
│       "outstandingAmount": 500000                                │
│     }                                                            │
│   ],                                                             │
│   "meta": {                                                      │
│     "timestamp": "2024-01-15T10:30:00.000Z"                      │
│   }                                                              │
│ }                                                                │
└──────────────────────────────────────────────────────────────────┘
```


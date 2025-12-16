# CRM Routing Architecture

## Frontend Route Structure

```
/
├── /login                          (Public)
├── /unauthorized                   (Public)
├── /forgot-password                (Public)
├── /reset-password                 (Public)
└── / (Protected - RequireAuth)
    ├── /dashboard                  (All roles)
    ├── /credit-management          (ADMIN, MANAGER)
    ├── /loans                       (All roles)
    ├── /overdue                     (All roles)
    ├── /legal                       (LEGAL, ADMIN, MANAGER)
    ├── /payments                    (All roles)
    ├── /reconciliation              (ADMIN only)
    ├── /disputes                    (MANAGER, ADMIN)
    ├── /promises                    (COLLECTOR, MANAGER, ADMIN)
    ├── /collector-performance       (MANAGER, ADMIN)
    ├── /customers/:id               (All roles)
    ├── /reports                     (ADMIN, MANAGER)
    ├── /settings                    (ADMIN only)
    └── /import                      (ADMIN only)
```

---

## Page Navigation Flow

### 1. Authentication Flow
```
Login (/login)
  ↓
Dashboard (/dashboard)
  ↓
[All other pages require auth]
```

### 2. Main Sidebar Navigation (10 items)
```
Dashboard
  ↓
Credit Management → Loans → Overdue → Legal → Payments → Reconciliation → Customers → Reports → Settings
```

### 3. Feature Pages (4 items)
```
Disputes (from Dashboard)
Promises (from Dashboard)
Collector Performance (from Dashboard)
Import (from Dashboard)
```

---

## Detailed Route Mapping

### Dashboard (Entry Point)
- **Route:** `/dashboard`
- **Component:** `Dashboard/index.jsx`
- **Access:** All authenticated users
- **Links to:**
  - Credit Management
  - Disbursed Loans
  - Overdue Management
  - Legal Cases
  - Payment Processing
  - Bank Reconciliation
  - Customers
  - Reports & Analytics
  - Settings
  - Disputes
  - Promises
  - Collector Performance
  - Import

### Credit Management
- **Route:** `/credit-management`
- **Component:** `CreditManagement/index.jsx`
- **Access:** ADMIN, MANAGER
- **Links to:**
  - Dashboard
  - Loans (for detailed analysis)

### Disbursed Loans
- **Route:** `/loans`
- **Component:** `Loans/index.jsx`
- **Access:** All roles
- **Links to:**
  - Dashboard
  - Customer Profile (`/customers/:id`)
  - Payment Processing (`/payments`)
  - Overdue Management (`/overdue`)

### Overdue Management
- **Route:** `/overdue`
- **Component:** `Overdue/OverdueBuckets.jsx`
- **Access:** All roles
- **Links to:**
  - Dashboard
  - Loans (`/loans`)
  - Legal Cases (`/legal`)
  - Payment Processing (`/payments`)
  - Promises (`/promises`)

### Legal Cases
- **Route:** `/legal`
- **Component:** `Legal/LegalCases.jsx`
- **Access:** LEGAL, ADMIN, MANAGER
- **Links to:**
  - Dashboard
  - Overdue Management (`/overdue`)
  - Customer Profile (`/customers/:id`)

### Payment Processing
- **Route:** `/payments`
- **Component:** `PaymentProcessing/index.jsx`
- **Access:** All roles
- **Links to:**
  - Dashboard
  - Loans (`/loans`)
  - Reconciliation (`/reconciliation`)
  - Customer Profile (`/customers/:id`)

### Bank Reconciliation
- **Route:** `/reconciliation`
- **Component:** `Reconciliation/BankReconciliation.jsx`
- **Access:** ADMIN only
- **Links to:**
  - Dashboard
  - Payment Processing (`/payments`)

### Customers
- **Route:** `/customers/:id`
- **Component:** `Customers/Detail.jsx`
- **Access:** All roles
- **Links to:**
  - Dashboard
  - Loans (`/loans`)
  - Payment Processing (`/payments`)
  - Promises (`/promises`)

### Reports & Analytics
- **Route:** `/reports`
- **Component:** `MISReports/index.jsx`
- **Access:** ADMIN, MANAGER
- **Links to:**
  - Dashboard
  - Collector Performance (`/collector-performance`)

### Disputes
- **Route:** `/disputes`
- **Component:** `Disputes/index.jsx`
- **Access:** MANAGER, ADMIN
- **Links to:**
  - Dashboard
  - Loans (`/loans`)
  - Overdue Management (`/overdue`)

### Promises
- **Route:** `/promises`
- **Component:** `Promises/index.jsx`
- **Access:** COLLECTOR, MANAGER, ADMIN
- **Links to:**
  - Dashboard
  - Loans (`/loans`)
  - Overdue Management (`/overdue`)

### Collector Performance
- **Route:** `/collector-performance`
- **Component:** `CollectorPerformance/index.jsx`
- **Access:** MANAGER, ADMIN
- **Links to:**
  - Dashboard
  - Reports (`/reports`)

### Settings
- **Route:** `/settings`
- **Component:** `Settings/index.jsx`
- **Access:** ADMIN only
- **Links to:**
  - Dashboard

### Import
- **Route:** `/import`
- **Component:** `Import/index.jsx`
- **Access:** ADMIN only
- **Links to:**
  - Dashboard
  - Loans (`/loans`)

---

## Role-Based Access Control

### COLLECTOR
✅ Can access:
- Dashboard
- Disbursed Loans
- Overdue Management
- Payment Processing
- Customers
- Promises

❌ Cannot access:
- Credit Management
- Legal Cases
- Bank Reconciliation
- Disputes
- Collector Performance
- Reports
- Settings
- Import

### MANAGER
✅ Can access:
- Dashboard
- Credit Management
- Disbursed Loans
- Overdue Management
- Legal Cases
- Payment Processing
- Customers
- Disputes
- Promises
- Collector Performance
- Reports

❌ Cannot access:
- Bank Reconciliation
- Settings
- Import

### LEGAL
✅ Can access:
- Dashboard
- Legal Cases
- Customers

❌ Cannot access:
- Credit Management
- Disbursed Loans
- Overdue Management
- Payment Processing
- Bank Reconciliation
- Disputes
- Promises
- Collector Performance
- Reports
- Settings
- Import

### ADMIN
✅ Can access:
- All pages

---

## Backend API Routes

### Authentication Routes
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Loan Routes
```
GET    /api/loans                    (List all loans)
GET    /api/loans/:id                (Get loan details)
POST   /api/loans                    (Create loan)
PUT    /api/loans/:id                (Update loan)
GET    /api/loans/:id/schedule       (Get instalments)
GET    /api/loans/collector/:id      (Get collector's loans)
```

### Payment Routes
```
GET    /api/payments                 (List payments)
POST   /api/payments/manual          (Record manual payment)
POST   /api/payments/bulk            (Bulk payment upload)
GET    /api/payments/:id             (Get payment details)
```

### Overdue Routes
```
GET    /api/overdue/buckets          (Get bucket-wise data)
GET    /api/overdue/aging            (Get aging report)
GET    /api/overdue/:loanId          (Get loan overdue details)
```

### Legal Routes
```
GET    /api/legal/cases              (List legal cases)
POST   /api/legal/cases              (Create legal case)
GET    /api/legal/cases/:id          (Get case details)
PUT    /api/legal/cases/:id          (Update case)
```

### Reconciliation Routes
```
POST   /api/reconciliation/upload    (Upload bank statement)
GET    /api/reconciliation/matches   (Get matched payments)
GET    /api/reconciliation/mismatches (Get mismatches)
POST   /api/reconciliation/resolve   (Resolve mismatch)
```

### Dispute Routes
```
GET    /api/disputes                 (List disputes)
POST   /api/disputes                 (Create dispute)
GET    /api/disputes/:id             (Get dispute details)
PUT    /api/disputes/:id             (Update dispute)
```

### Promise Routes
```
GET    /api/promises                 (List promises)
POST   /api/promises                 (Create promise)
GET    /api/promises/:id             (Get promise details)
PUT    /api/promises/:id             (Update promise)
```

### Collector Performance Routes
```
GET    /api/collector-performance    (Get all collectors)
GET    /api/collector-performance/:id (Get collector details)
GET    /api/collector-performance/:id/score (Get collector score)
```

### Reports Routes
```
GET    /api/reports/mis              (Get MIS report)
GET    /api/reports/collection       (Get collection report)
GET    /api/reports/aging            (Get aging report)
GET    /api/reports/branch           (Get branch report)
```

### Import Routes
```
POST   /api/import/loans/validate    (Validate loans CSV)
POST   /api/import/loans/preview     (Preview loans)
POST   /api/import/loans/confirm     (Confirm import)
POST   /api/import/payments/validate (Validate payments CSV)
POST   /api/import/payments/confirm  (Confirm import)
```

### Customer Routes
```
GET    /api/customers                (List customers)
GET    /api/customers/:id            (Get customer details)
POST   /api/customers                (Create customer)
PUT    /api/customers/:id            (Update customer)
```

---

## Navigation Hierarchy

```
Level 1: Authentication
├── Login
├── Forgot Password
└── Reset Password

Level 2: Main Dashboard
└── Dashboard (Hub)

Level 3: Operational Pages (Sidebar)
├── Credit Management
├── Disbursed Loans
├── Overdue Management
├── Legal Cases
├── Payment Processing
├── Bank Reconciliation
├── Customers
├── Reports & Analytics
└── Settings

Level 4: Feature Pages (Secondary)
├── Disputes
├── Promises
├── Collector Performance
└── Import

Level 5: Detail Pages (Tertiary)
└── Customer Profile (/customers/:id)
```

---

## Cross-Page Navigation Links

### From Dashboard
- → Credit Management
- → Disbursed Loans
- → Overdue Management
- → Legal Cases
- → Payment Processing
- → Bank Reconciliation
- → Customers
- → Reports & Analytics
- → Settings
- → Disputes
- → Promises
- → Collector Performance
- → Import

### From Loans
- → Dashboard
- → Customer Profile
- → Payment Processing
- → Overdue Management

### From Overdue
- → Dashboard
- → Loans
- → Legal Cases
- → Payment Processing
- → Promises

### From Legal
- → Dashboard
- → Overdue Management
- → Customer Profile

### From Payments
- → Dashboard
- → Loans
- → Reconciliation
- → Customer Profile

### From Reconciliation
- → Dashboard
- → Payment Processing

### From Reports
- → Dashboard
- → Collector Performance

### From Disputes
- → Dashboard
- → Loans
- → Overdue Management

### From Promises
- → Dashboard
- → Loans
- → Overdue Management

### From Collector Performance
- → Dashboard
- → Reports

### From Customer Profile
- → Dashboard
- → Loans
- → Payment Processing
- → Promises

---

## Query Parameters

### Loans Page
```
/loans?status=ACTIVE&bucket=1-7&collector=123
```

### Overdue Page
```
/overdue?bucket=30+&sortBy=dpd&order=desc
```

### Reports Page
```
/reports?type=collection&period=monthly&branch=001
```

### Customers Page
```
/customers/:id?tab=loans&period=30days
```

---

## Protected Routes Middleware

All routes under `/` require:
1. Valid JWT token
2. User must be active
3. Role-based access check

```javascript
<RequireAuth>
  <RequireRole roles={['ADMIN', 'MANAGER']}>
    <Page />
  </RequireRole>
</RequireAuth>
```

---

## Error Handling Routes

```
/unauthorized    → 403 Forbidden
/not-found       → 404 Not Found
/*               → Redirect to /dashboard
```

---

## Summary

- **Total Routes:** 18 pages
- **Protected Routes:** 14 pages
- **Public Routes:** 4 pages
- **API Endpoints:** 50+ endpoints
- **Role-Based Pages:** 12 pages
- **Unrestricted Pages:** 2 pages (Dashboard, Loans, Payments, Customers)

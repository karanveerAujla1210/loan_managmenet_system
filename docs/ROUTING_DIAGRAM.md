# CRM Routing Diagram

## Complete Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /login ──────────────────────────────────────────────────────┐  │
│    ↓                                                           │  │
│  /forgot-password                                             │  │
│    ↓                                                           │  │
│  /reset-password                                              │  │
│                                                               ↓  │
│                                                    [JWT Token Valid]
│                                                               ↓  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MAIN DASHBOARD (Hub)                          │
│                        /dashboard                                │
│                   (All authenticated users)                      │
└─────────────────────────────────────────────────────────────────┘
                                ↓
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
    [SIDEBAR]            [FEATURE PAGES]         [DETAIL PAGES]
    (10 items)           (4 items)               (Dynamic)
        │                     │                       │
        ├─ Credit Mgmt        ├─ Disputes             └─ /customers/:id
        ├─ Loans              ├─ Promises
        ├─ Overdue            ├─ Collector Perf
        ├─ Legal              └─ Import
        ├─ Payments
        ├─ Reconciliation
        ├─ Customers
        ├─ Reports
        └─ Settings
```

---

## Sidebar Navigation (Primary Flow)

```
DASHBOARD
    ↓
    ├─→ CREDIT MANAGEMENT (ADMIN, MANAGER)
    │       ↓
    │       └─→ Loans
    │
    ├─→ DISBURSED LOANS (All roles)
    │       ↓
    │       ├─→ Customer Profile
    │       ├─→ Payment Processing
    │       └─→ Overdue Management
    │
    ├─→ OVERDUE MANAGEMENT (All roles)
    │       ↓
    │       ├─→ Loans
    │       ├─→ Legal Cases
    │       ├─→ Payment Processing
    │       └─→ Promises
    │
    ├─→ LEGAL CASES (LEGAL, ADMIN, MANAGER)
    │       ↓
    │       ├─→ Overdue Management
    │       └─→ Customer Profile
    │
    ├─→ PAYMENT PROCESSING (All roles)
    │       ↓
    │       ├─→ Loans
    │       ├─→ Reconciliation
    │       └─→ Customer Profile
    │
    ├─→ BANK RECONCILIATION (ADMIN only)
    │       ↓
    │       └─→ Payment Processing
    │
    ├─→ CUSTOMERS (All roles)
    │       ↓
    │       ├─→ Loans
    │       ├─→ Payment Processing
    │       └─→ Promises
    │
    ├─→ REPORTS & ANALYTICS (ADMIN, MANAGER)
    │       ↓
    │       └─→ Collector Performance
    │
    └─→ SETTINGS (ADMIN only)
            ↓
            └─→ User Management
```

---

## Feature Pages (Secondary Flow)

```
DASHBOARD
    ↓
    ├─→ DISPUTES (MANAGER, ADMIN)
    │       ↓
    │       ├─→ Loans
    │       └─→ Overdue Management
    │
    ├─→ PROMISES (COLLECTOR, MANAGER, ADMIN)
    │       ↓
    │       ├─→ Loans
    │       └─→ Overdue Management
    │
    ├─→ COLLECTOR PERFORMANCE (MANAGER, ADMIN)
    │       ↓
    │       └─→ Reports
    │
    └─→ IMPORT (ADMIN only)
            ↓
            └─→ Loans
```

---

## Role-Based Access Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                         COLLECTOR                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard                                                        │
│    ├─ Loans                                                       │
│    ├─ Overdue Management                                          │
│    ├─ Payment Processing                                          │
│    ├─ Customers                                                   │
│    └─ Promises                                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         MANAGER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard                                                        │
│    ├─ Credit Management                                           │
│    ├─ Loans                                                       │
│    ├─ Overdue Management                                          │
│    ├─ Legal Cases                                                 │
│    ├─ Payment Processing                                          │
│    ├─ Customers                                                   │
│    ├─ Disputes                                                    │
│    ├─ Promises                                                    │
│    ├─ Collector Performance                                       │
│    └─ Reports & Analytics                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         LEGAL                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard                                                        │
│    ├─ Legal Cases                                                 │
│    └─ Customers                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard                                                        │
│    ├─ Credit Management                                           │
│    ├─ Loans                                                       │
│    ├─ Overdue Management                                          │
│    ├─ Legal Cases                                                 │
│    ├─ Payment Processing                                          │
│    ├─ Bank Reconciliation                                         │
│    ├─ Customers                                                   │
│    ├─ Disputes                                                    │
│    ├─ Promises                                                    │
│    ├─ Collector Performance                                       │
│    ├─ Reports & Analytics                                         │
│    ├─ Settings                                                    │
│    └─ Import                                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Between Pages

```
LOANS PAGE
    ↓
    ├─ Fetch: GET /api/loans
    ├─ Display: List of loans
    ├─ Click loan → /customers/:id
    ├─ Click "Record Payment" → /payments
    └─ Click "View Overdue" → /overdue?loanId=123

OVERDUE PAGE
    ↓
    ├─ Fetch: GET /api/overdue/buckets
    ├─ Display: Bucket-wise data
    ├─ Click loan → /loans
    ├─ Click "Legal" → /legal
    ├─ Click "Pay" → /payments?loanId=123
    └─ Click "Promise" → /promises?loanId=123

PAYMENT PROCESSING PAGE
    ↓
    ├─ Fetch: GET /api/payments
    ├─ Display: Payment history
    ├─ Click loan → /loans
    ├─ Click "Reconcile" → /reconciliation
    └─ Click customer → /customers/:id

LEGAL CASES PAGE
    ↓
    ├─ Fetch: GET /api/legal/cases
    ├─ Display: Legal cases
    ├─ Click loan → /loans
    └─ Click customer → /customers/:id

RECONCILIATION PAGE
    ↓
    ├─ Fetch: GET /api/reconciliation/matches
    ├─ Display: Matched/unmatched payments
    └─ Click payment → /payments

REPORTS PAGE
    ↓
    ├─ Fetch: GET /api/reports/mis
    ├─ Display: MIS data
    └─ Click collector → /collector-performance/:id

COLLECTOR PERFORMANCE PAGE
    ↓
    ├─ Fetch: GET /api/collector-performance
    ├─ Display: Collector scores
    └─ Click collector → /collector-performance/:id

CUSTOMER PROFILE PAGE
    ↓
    ├─ Fetch: GET /api/customers/:id
    ├─ Display: Customer details
    ├─ Tab "Loans" → /loans?customerId=123
    ├─ Tab "Payments" → /payments?customerId=123
    └─ Tab "Promises" → /promises?customerId=123
```

---

## API Endpoint Mapping

```
Frontend Route          →    Backend API Endpoint
─────────────────────────────────────────────────────
/dashboard              →    GET /api/dashboard
/credit-management      →    GET /api/loans/analytics
/loans                  →    GET /api/loans
/loans/:id              →    GET /api/loans/:id
/overdue                →    GET /api/overdue/buckets
/legal                  →    GET /api/legal/cases
/payments               →    GET /api/payments
/payments (record)      →    POST /api/payments/manual
/reconciliation         →    GET /api/reconciliation/matches
/disputes               →    GET /api/disputes
/promises               →    GET /api/promises
/collector-performance  →    GET /api/collector-performance
/customers/:id          →    GET /api/customers/:id
/reports                →    GET /api/reports/mis
/settings               →    GET /api/settings
/import                 →    POST /api/import/loans/validate
```

---

## Breadcrumb Navigation

```
Dashboard
  └─ Credit Management
      └─ Loans
          └─ Customer Profile

Dashboard
  └─ Overdue Management
      └─ Legal Cases
          └─ Customer Profile

Dashboard
  └─ Payment Processing
      └─ Reconciliation

Dashboard
  └─ Reports & Analytics
      └─ Collector Performance

Dashboard
  └─ Disputes
      └─ Loans

Dashboard
  └─ Promises
      └─ Overdue Management
```

---

## Session & State Management

```
Login
  ↓
[Store JWT Token]
  ↓
[Store User Role]
  ↓
[Store User ID]
  ↓
Dashboard (Check role → Show available pages)
  ↓
[Each page checks role before rendering]
  ↓
[API calls include JWT token]
  ↓
Logout
  ↓
[Clear JWT Token]
  ↓
[Clear User Data]
  ↓
Redirect to /login
```

---

## Error Handling Routes

```
Valid JWT + Valid Role
  ↓
  ├─ Page renders ✓
  │
Invalid JWT
  ↓
  ├─ Redirect to /login
  │
Valid JWT + Invalid Role
  ↓
  ├─ Redirect to /unauthorized
  │
Page not found
  ↓
  ├─ Redirect to /dashboard
```

---

## Mobile Navigation

```
Desktop: Sidebar (always visible)
  ↓
Mobile: Hamburger menu (toggle)
  ↓
  ├─ Dashboard
  ├─ Credit Management
  ├─ Loans
  ├─ Overdue
  ├─ Legal
  ├─ Payments
  ├─ Reconciliation
  ├─ Customers
  ├─ Reports
  ├─ Settings
  ├─ Disputes
  ├─ Promises
  ├─ Collector Performance
  └─ Import
```

---

## Query Parameter Usage

```
/loans?status=ACTIVE&bucket=1-7&collector=123&page=1&limit=20

/overdue?bucket=30+&sortBy=dpd&order=desc&page=1

/reports?type=collection&period=monthly&branch=001&startDate=2024-01-01

/customers/:id?tab=loans&period=30days

/payments?loanId=123&status=PENDING

/disputes?status=OPEN&assignedTo=456

/promises?status=PENDING&dueDate=2024-01-31
```

---

## Protected Route Guards

```
RequireAuth
  ├─ Check JWT token exists
  ├─ Check JWT token valid
  ├─ Check user is active
  └─ Allow access

RequireRole(['ADMIN', 'MANAGER'])
  ├─ Check user role
  ├─ If role matches → Allow access
  └─ If role doesn't match → Redirect to /unauthorized
```

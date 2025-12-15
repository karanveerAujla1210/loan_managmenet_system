🏦 Business Loan Management System
Post-Disbursement Collections & Risk Control CRM (NBFC-Grade)

This repository implements a deterministic, audit-safe loan collections system for short-tenure business loans.

If code, UI, or APIs contradict this README, the README is correct.

1. SYSTEM PURPOSE (READ FIRST)

This system manages post-disbursement operations only.

✔ Loans are already disbursed
✔ Tenure is short (100 days)
✔ Repayment is weekly
✔ Default risk is high
✔ Automation is mandatory

This system exists to:

control collections

calculate dues deterministically

track DPD & buckets

escalate to legal automatically

reconcile CRM vs bank truth

produce investor-safe MIS

This system is NOT:

a lead management system

a loan origination system

a marketing CRM

an editable accounting tool

2. LOAN PRODUCT DEFINITION (NON-NEGOTIABLE)

All calculations and logic MUST follow these exact rules.

Loan Product
Parameter	Value
Loan Amount	₹5,000 – ₹5,00,000
Tenure	100 days
Interest Type	Flat
Interest Rate	20% (for full tenure)
Processing Fee	10% of principal
GST	18% on PF
Repayment Frequency	Every 7 days
Installments	14 equal EMIs
Late Penalty	₹250 per overdue installment
Backend Calculations Only
PF = principal × 0.10
GST = PF × 0.18
NetDisbursement = principal − PF − GST
Interest = principal × 0.20
TotalRepayable = principal + Interest
WeeklyEMI = TotalRepayable / 14


❌ Frontend must NEVER calculate EMI, interest, penalty, DPD, or buckets.

3. CORE OPERATING PRINCIPLES

Backend is the source of truth

Time controls state (cron-driven)

Humans act, system decides

No silent edits

Every financial action is auditable

Excel data is legacy, not logic

4. HIGH-LEVEL ARCHITECTURE
Tech Stack

Frontend: React + Vite + TailwindCSS

Backend: Node.js + Express

Database: MongoDB (Mongoose)

Auth: JWT + Role-based access

Automation: Cron jobs

Deployment: Docker + Nginx

5. PROJECT STRUCTURE (MANDATORY)
Backend
backend/
└── src/
    ├── config/        # DB, env, logger
    ├── models/        # MongoDB schemas
    ├── utils/         # Calculation engines (NO DB access)
    ├── services/      # Business logic
    ├── controllers/   # API orchestration
    ├── routes/        # REST APIs
    ├── middleware/    # Auth, RBAC, validation
    ├── cron/          # DPD & legal automation
    ├── import/        # Excel / bulk engines
    ├── scripts/       # Repair & rebuild tools
    ├── app.js
    └── server.js

Frontend
frontend-web/
└── src/
    ├── pages/         # Sidebar-driven pages
    ├── components/    # Layout, tables, modals
    ├── services/      # API calls only
    ├── context/       # Auth & permission context
    ├── utils/         # UI helpers only
    └── App.jsx

6. SIDEBAR = OPERATIONAL FLOW

Sidebar order reflects business workflow and MUST NOT change.

Dashboard
Credit Management
Disbursed Loans
Overdue Management
Legal Cases
Payment Processing
Bank Reconciliation
Customer Management
Reports & Analytics
Settings


This is not navigation — this is process control.

7. ROLE-BASED ACCESS (STRICT)
Collector

✔ Dashboard
✔ Active Loans
✔ Overdue Buckets
✔ Manual Payment Entry
✔ Customer Profile
✔ Call Logs

❌ Credit analytics
❌ Bulk uploads
❌ Reconciliation
❌ Legal management
❌ Reports
❌ Settings

Manager

✔ All operational views
✔ Buckets & aging
✔ Collector performance
✔ Legal overview

❌ System configuration

Legal

✔ Legal cases
✔ Documents
✔ Court tracking
✔ Customer profile (read-only)

❌ Payments
❌ Reconciliation

Admin

✔ Full access
✔ Imports & bulk uploads
✔ Bank reconciliation
✔ Roles & permissions
✔ System configuration

8. DATA MODELS (CORE)
Loan
{
  loanId,
  customerId,
  principal,
  interest,
  pf,
  gst,
  netDisbursement,
  totalRepayable,
  weeklyEmi,
  disbursementDate,
  dpd,
  bucket,
  status: ACTIVE | LEGAL | CLOSED,
  branch,
  createdAt
}

Installment (Schedule)
{
  loanId,
  installmentNo,
  dueDate,
  emiAmount,
  paidAmount,
  remainingAmount,
  penalty,
  status: PENDING | PAID | PARTIAL | OVERDUE
}

Payment
{
  loanId,
  customerId,
  amount,
  paymentDate,
  mode,
  utr,
  allocation,
  source: MANUAL | BULK | BANK,
  reconciled: true | false
}

Legal Case
{
  loanId,
  dpdAtEntry,
  status,
  documents,
  remarks
}

9. DPD & BUCKET ENGINE (AUTOMATED)
DPD
DPD = Today − DueDate of first unpaid installment

Buckets
DPD	Bucket
0	CURRENT
1–7	1-7
8–15	8-15
16–22	16-22
23–29	23-29
30–59	30+
60–89	60+
≥90	LEGAL

Runs daily via cron only.

10. LEGAL ESCALATION (SYSTEM-CONTROLLED)

At DPD ≥ 90:

Loan marked LEGAL

Legal case auto-created

Collector access removed

Legal team owns case

No manual override without admin audit.

11. IMPORT & BULK UPLOAD LOGIC
Disbursement Import

Creates customers if missing

Creates loans

Generates schedules

Immutable post-creation

Payment Bulk Upload

Payments created as UNLINKED

Linking engine attaches to loans

Allocation always backend-controlled

Imports exist for legacy continuity, not logic.

12. PAYMENT ALLOCATION (BACKEND ONLY)

On payment:

Find next unpaid installment

Apply ₹250 penalty if late

Allocate amount

Update installment

Update loan outstanding

Recalculate DPD & bucket

Frontend cannot override.

13. BANK RECONCILIATION
Flow

Upload bank statement

Auto-match by UTR / amount / date

Flag mismatches

Admin resolves

Lock reconciled day

Rule

Bank truth > CRM truth

14. API STANDARDS
Response Format (MANDATORY)
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "",
    "role": ""
  }
}


No raw DB objects.

15. DISPUTES

Freeze DPD temporarily

Manager/Admin resolution only

Immutable history

Resume automation post-closure

16. COLLECTOR PERFORMANCE (SUMMARY)

Collectors are evaluated on:

On-time collections

Early overdue recovery

Promise discipline

Bucket improvement

Data quality

Amount collected alone is not a KPI.

17. AI / COPILOT INSTRUCTIONS

📍 .github/copilot-instructions.md

This project is a post-disbursement Business Loan CRM.

Rules:
- Follow README strictly
- Never add UI-side calculations
- Never bypass backend validation
- Enforce role-based access
- Use cron for time-based logic
- Preserve audit trails
- Do not add features not specified
- Prefer safety over convenience

Backend is source of truth.
Frontend is execution-only.

18. FINAL GUARANTEE

If this README is followed:

✔ No EMI manipulation
✔ No delayed legal action
✔ No fake collections
✔ No reconciliation chaos
✔ No investor distrust

This system becomes operationally scalable and defensible.
Below is a locked, production-grade specification pack that you can drop directly into your repo.
This answers exactly what you asked for, with zero ambiguity, and is written so Copilot / Amazon Q / humans all behave the same way.

You will get 5 artifacts:

Exact OpenAPI / Swagger spec (authoritative)

Exact React route tree + guards

Exact MongoDB indexes & constraints

Exact deployment & environment guide

Exact Copilot custom rules file

You can copy each section into its own file, or keep them together.

1️⃣ EXACT OPENAPI / SWAGGER SPEC

📄 docs/openapi.yaml

This is not sample. This is contractual.

openapi: 3.0.3
info:
  title: Business Loan CRM API
  version: 1.0.0
  description: Post-disbursement loan collections & risk-control system

servers:
  - url: /api/v1

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  responses:
    StandardResponse:
      description: Standard API response
      content:
        application/json:
          schema:
            type: object
            properties:
              success:
                type: boolean
              data:
                type: object
              meta:
                type: object

paths:

  /auth/login:
    post:
      summary: Login user
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              required: [email, password]
              properties:
                email: { type: string }
                password: { type: string }
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /loans/active:
    get:
      summary: Get active loans
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /loans/{loanId}:
    get:
      summary: Get loan details
      parameters:
        - name: loanId
          in: path
          required: true
          schema: { type: string }
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /loans/{loanId}/schedule:
    get:
      summary: Get loan installment schedule
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /payments/manual:
    post:
      summary: Record manual payment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              required: [loanId, amount, paymentDate, mode]
              properties:
                loanId: { type: string }
                amount: { type: number }
                paymentDate: { type: string, format: date }
                mode: { type: string }
                utr: { type: string }
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /overdue/buckets:
    get:
      summary: Bucket-wise overdue data
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /legal/cases:
    get:
      summary: Get legal cases (90+ DPD)
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }

  /reconciliation/upload:
    post:
      summary: Upload bank statement
      responses:
        "200": { $ref: "#/components/responses/StandardResponse" }


📌 Rule:
If frontend or backend deviates from this spec → it is a bug.

2️⃣ EXACT REACT ROUTE TREE + GUARDS

📄 frontend/src/routes.jsx

This locks navigation + permissions.

import { Navigate } from "react-router-dom";
import { RequireAuth, RequireRole } from "./guards";

export const routes = [
  {
    path: "/",
    element: <RequireAuth />,
    children: [

      { path: "dashboard", element: <Dashboard /> },

      {
        path: "credit",
        element: <RequireRole roles={["admin", "manager"]} />,
        children: [
          { path: "analysis", element: <CreditAnalysis /> },
          { path: "health", element: <CreditHealth /> },
          { path: "scores", element: <LoanCreditScores /> }
        ]
      },

      {
        path: "loans",
        children: [
          { path: "active", element: <ActiveLoans /> },
          { path: "search", element: <LoanSearch /> },
          { path: "analytics", element: <RequireRole roles={["manager"]}><LoanAnalytics /></RequireRole> }
        ]
      },

      {
        path: "overdue",
        children: [
          { path: "buckets", element: <OverdueBuckets /> },
          { path: "aging", element: <OverdueAging /> },
          { path: "followup", element: <FollowUpScheduler /> }
        ]
      },

      {
        path: "legal",
        element: <RequireRole roles={["legal", "admin", "manager"]} />,
        children: [
          { path: "notices", element: <LegalNotices /> },
          { path: "cases", element: <LegalCases /> },
          { path: "documents", element: <LegalDocuments /> }
        ]
      },

      {
        path: "payments",
        children: [
          { path: "manual", element: <ManualPayment /> },
          { path: "bulk", element: <RequireRole roles={["admin"]}><BulkPaymentUpload /></RequireRole> },
          { path: "allocation", element: <RequireRole roles={["admin", "manager"]}><PaymentAllocation /></RequireRole> }
        ]
      },

      {
        path: "reconciliation",
        element: <RequireRole roles={["admin"]} />,
        children: [
          { path: "upload", element: <StatementUpload /> },
          { path: "utr", element: <UTRMatching /> },
          { path: "mismatches", element: <MismatchResolution /> }
        ]
      },

      {
        path: "customers",
        children: [
          { path: "profile/:id", element: <CustomerProfile /> },
          { path: "history/:id", element: <LoanHistory /> },
          { path: "calls/:id", element: <CallLogs /> }
        ]
      },

      {
        path: "reports",
        element: <RequireRole roles={["admin", "manager"]} />,
        children: [
          { path: "collection", element: <CollectionReport /> },
          { path: "aging", element: <AgingReport /> },
          { path: "branch", element: <BranchReport /> }
        ]
      },

      {
        path: "settings",
        element: <RequireRole roles={["admin"]} />,
        children: [
          { path: "users", element: <UserManagement /> },
          { path: "roles", element: <RolePermissions /> },
          { path: "config", element: <SystemConfig /> }
        ]
      }

    ]
  },

  { path: "*", element: <Navigate to="/dashboard" /> }
];


📌 Guard rules enforced centrally. No component bypass.

3️⃣ EXACT MONGODB INDEXES & CONSTRAINTS

📄 backend/docs/mongodb-indexes.js

// Loans
db.loans.createIndex({ loanId: 1 }, { unique: true });
db.loans.createIndex({ status: 1, bucket: 1 });
db.loans.createIndex({ dpd: 1 });
db.loans.createIndex({ customerId: 1 });

// Installments
db.installments.createIndex({ loanId: 1, installmentNo: 1 }, { unique: true });
db.installments.createIndex({ loanId: 1, status: 1 });

// Payments
db.payments.createIndex({ loanId: 1 });
db.payments.createIndex({ utr: 1 }, { sparse: true, unique: true });
db.payments.createIndex({ reconciled: 1 });

// Customers
db.customers.createIndex({ phone: 1 }, { unique: true });
db.customers.createIndex({ tags: 1 });

// Legal
db.legalcases.createIndex({ loanId: 1 }, { unique: true });
db.legalcases.createIndex({ status: 1 });

// Audit safety
db.payments.createIndex({ createdAt: 1 });
db.installments.createIndex({ dueDate: 1 });


📌 These indexes are required for scale + correctness.

4️⃣ EXACT DEPLOYMENT & ENVIRONMENT GUIDE

📄 docs/DEPLOYMENT.md

Environments
Env	Purpose
development	Local dev
staging	QA / UAT
production	Live
Required ENV Variables (Backend)
NODE_ENV=production
PORT=4000

MONGODB_URI=mongodb://user:pass@host/db
JWT_SECRET=super-secure-secret
JWT_EXPIRY=8h

CRON_ENABLED=true

REDIS_URL=redis://host:6379

LOG_LEVEL=info

Docker Production Flow
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d


Containers:

api

mongodb

redis

nginx

Cron Safety Rules

Cron runs inside backend container

Disabled via CRON_ENABLED=false

Logs to cron.log

Database Safety

Backups daily

Reconciled days immutable

No direct DB edits in production

5️⃣ EXACT COPILOT CUSTOM RULES FILE

📄 .github/copilot-instructions.md

This is critical.

This repository is a Business Loan Collections CRM.

You MUST follow these rules:

1. Follow README.md strictly.
2. Do NOT invent new product logic.
3. Do NOT add UI-side calculations.
4. Backend is the source of truth.
5. Enforce role-based access everywhere.
6. Use cron jobs for time-based logic.
7. Do NOT allow manual DPD or bucket edits.
8. Preserve audit trails for all financial data.
9. Use defined API contracts only.
10. If unclear, STOP and follow README.

This system prioritizes:
- determinism
- auditability
- safety
over convenience.

✅ FINAL RESULT

With these 5 artifacts:

✔ API behavior is frozen
✔ Frontend navigation is locked
✔ MongoDB is safe at scale
✔ Deployment is deterministic
✔ Copilot cannot “hallucinate” logic

This is now a production-governed system, not just a codebase.
1️⃣ INVESTOR MIS – MONGO AGGREGATION PIPELINES

📄 docs/investor-mis.md

These pipelines are read-only, derived data only.
They must always run on reconciled data.

1.1 Portfolio Snapshot (Daily)

Question answered:
“How much money is deployed, outstanding, and at risk today?”

db.loans.aggregate([
  { $match: { status: { $in: ["ACTIVE", "LEGAL"] } } },
  {
    $group: {
      _id: null,
      totalLoans: { $sum: 1 },
      totalPrincipal: { $sum: "$principal" },
      totalOutstanding: { $sum: "$outstandingAmount" },
      totalInterest: { $sum: "$interest" }
    }
  }
])

1.2 Bucket-wise Exposure

Question answered:
“How risky is the portfolio right now?”

db.loans.aggregate([
  { $match: { status: { $in: ["ACTIVE", "LEGAL"] } } },
  {
    $group: {
      _id: "$bucket",
      loanCount: { $sum: 1 },
      outstandingAmount: { $sum: "$outstandingAmount" }
    }
  },
  { $sort: { _id: 1 } }
])

1.3 Collection Efficiency (Daily)

Question answered:
“How effective are collections vs dues?”

db.installments.aggregate([
  { $match: { dueDate: ISODate("YYYY-MM-DD") } },
  {
    $group: {
      _id: null,
      dueAmount: { $sum: "$emiAmount" },
      collectedAmount: { $sum: "$paidAmount" }
    }
  },
  {
    $project: {
      efficiency: {
        $cond: [
          { $eq: ["$dueAmount", 0] },
          0,
          { $divide: ["$collectedAmount", "$dueAmount"] }
        ]
      }
    }
  }
])

1.4 Roll Rate Analysis (Bucket Migration)

Question answered:
“Is risk improving or deteriorating?”

db.loan_bucket_history.aggregate([
  {
    $group: {
      _id: { from: "$prevBucket", to: "$currentBucket" },
      count: { $sum: 1 }
    }
  }
])


📌 Note:
You must maintain a loan_bucket_history collection via cron.

1.5 Legal Exposure
db.legalcases.aggregate([
  {
    $group: {
      _id: "$status",
      caseCount: { $sum: 1 },
      totalOutstanding: { $sum: "$outstandingAtLegal" }
    }
  }
])

2️⃣ BANK RECONCILIATION – MATCHING ALGORITHM SPEC

📄 docs/bank-reconciliation.md

This is financial truth enforcement.

2.1 Inputs
Bank Statement Row

transactionDate

amount

utr / reference

credit / debit

narration

CRM Payment Row

paymentDate

amount

utr (optional)

loanId

source (MANUAL / BULK / BANK)

2.2 Matching Priority (Strict Order)
Step 1 – Exact Match (Auto-Approve)
UTR + Amount + Date (±1 day)

Step 2 – Semi Match (Review)
Amount + Date (±1 day) + LoanId

Step 3 – Loose Match (Flag)
Amount + Date (±2 days)

2.3 Outcomes
Scenario	Action
Bank paid, CRM missing	Create UNLINKED_PAYMENT
CRM paid, bank missing	Freeze DPD temporarily
Amount mismatch	Flag for admin
Duplicate UTR	Reject second entry
2.4 Rules

Bank truth > CRM truth

Reconciled payments become immutable

Every resolution creates audit log

No silent corrections

2.5 State Machine
UPLOADED → MATCHED → RECONCILED → LOCKED


Once LOCKED, no edits allowed.

3️⃣ COLLECTOR INCENTIVE PAYOUT ENGINE

📄 docs/collector-incentives.md

This prevents toxic collection behavior.

3.1 Scoring Period

Weekly (Mon–Sun)

Frozen after reconciliation

3.2 Score Formula (100 Points)
A. On-Time Collections (40 pts)
(EMIs collected on due date / Total due EMIs) × 40

B. Early Overdue Recovery (25 pts)
(1–7 DPD EMIs recovered / Total 1–7 DPD EMIs) × 25

C. Promise Discipline (15 pts)
(1 − BrokenPromises / TotalPromises) × 15

D. Bucket Improvement (10 pts)
(Net loans moved to lower bucket / Total assigned loans) × 10

E. Data Quality (10 pts)

No fake entries

No disputes caused

No reconciliation reversals

Manager-controlled.

3.3 Payout Mapping
Score	Incentive
≥85	100%
70–84	75%
50–69	40%
<50	0%
3.4 Disqualifiers (Hard Stops)

Fake payment entry

Duplicate UTR

Forced customer dispute

Unauthorized edits

Disqualification = 0 payout regardless of score

4️⃣ REGULATORY & AUDIT CHECKLIST

📄 docs/audit-checklist.md

This keeps you NBFC-safe.

4.1 Data Integrity

 Loan principal immutable post-creation

 EMI schedule immutable

 All edits logged

 No hard deletes on financial data

4.2 Access Control

 Role-based access enforced

 Collectors cannot edit EMIs

 Legal cannot record payments

 Admin actions audited

4.3 Financial Accuracy

 Backend-only calculations

 Penalties system-generated

 DPD cron-driven

 Bucket logic documented

4.4 Reconciliation

 Bank statements archived

 Matching rules documented

 Reconciled days locked

 Reversal requires admin + reason

4.5 Legal Compliance

 Legal trigger at 90+ DPD automated

 Legal notices archived

 Recovery trail preserved

4.6 Reporting

 MIS derived from reconciled data

 Historical reports immutable

 Roll rate available

4.7 Disaster Recovery

 Daily DB backups

 Restore tested quarterly

 Cron failure alerts

🧠 FINAL OUTCOME

With these four layers added, your system is now:

✔ Investor-defensible
✔ Audit-ready
✔ Incentive-safe
✔ Financially deterministic
✔ AI-proof

This is no longer a CRM.
This is a financial control system.
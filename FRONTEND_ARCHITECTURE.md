# Frontend Architecture - Complete Loan Lifecycle System

## Overview
Production-ready frontend mapping the complete loan lifecycle with role-based access control and automated workflows.

## Loan Lifecycle Stages (8 Stages)

### 🔵 STAGE 1: LEAD & APPLICATION
**Pages:**
- **Lead Dashboard** (`/leads`) - Capture demand, not approve
  - New leads, Follow-ups due, Converted leads, Lost leads
  - Actions: Create Lead, Call, Add Note, Schedule Follow-up, Convert to Application, Mark Lost
  - Owner: Telecaller, Manager, Admin

- **Loan Application** (`/application`) - Collect structured data
  - Personal details, Business details, Income & obligations, Bank details, Document upload
  - Actions: Save Draft, Submit Application
  - Owner: Customer, Telecaller, Manager, Admin
  - Control: Once submitted → LOCK EDITING

### 🟠 STAGE 2: CREDIT & RISK
**Pages:**
- **Credit Assessment** (`/credit-assessment`) - Decide should we lend
  - Application summary, Income vs EMI, Credit score, Existing liabilities, Risk flags
  - Actions: Recommend Approval, Recommend Conditional Approval, Recommend Rejection, Add Credit Notes
  - Owner: Credit Analyst, Manager, Admin
  - Automation: FOIR calculation, Risk band tagging, Rule-based alerts
  - Control: Analyst cannot disburse or change amount

- **Approval** (`/approval`) - Final authority
  - Credit recommendation, Proposed loan terms, Risk indicators
  - Actions: Approve, Modify Terms, Reject, Send Back to Credit
  - Owner: Manager, Admin
  - Automation: Approval limits by role, Audit logs
  - Control: Once approved → immutable approval record

### 🟢 STAGE 3: DISBURSEMENT
**Pages:**
- **Disbursement Queue** (`/disbursement`) - Release money safely
  - Approved loans pending disbursement, Bank verification status
  - Actions: Verify Bank, Disburse, Hold/Cancel
  - Owner: Operations, Finance, Manager, Admin
  - Automation: Bank account validation, Disbursement date capture, Repayment schedule generation
  - Control: Disbursement = accounting event. Cannot be undone casually

### 🔁 STAGE 4: REPAYMENT & LIVE LOAN
**Pages:**
- **Active Loans Dashboard** (`/active-loans`) - Monitor health of book
  - Active loans, EMI schedules, Upcoming dues, DPD buckets
  - Actions: View Loan, Download Statement, Add Operational Note
  - Owner: Operations, Manager, Admin, Collector, Collections Head
  - Automation: EMI due reminders, DPD calculation (daily)

- **Loan 360 View** (`/loan/:id`) - Single source of truth
  - Tabs: Overview, Installments, Payments, Notes, Documents, Audit log
  - Actions: Record Payment, Edit (restricted), Upload Document
  - Owner: Everyone (role-based)
  - Control: All actions logged. No silent edits

### 🔴 STAGE 5: COLLECTIONS (MOST CRITICAL)
**Pages:**
- **Collections Dashboard** (`/collections`) - Prevent loss
  - Loans by DPD bucket, Collector assignment, Efficiency metrics
  - Actions: Assign Collector, Reassign, Escalate
  - Owner: Collections Head, Manager, Admin
  - Key Metrics:
    - Total Active Loans
    - Total Outstanding
    - At Risk (>0 DPD)
    - Risk %
    - Bucket-wise distribution
    - Collector performance

- **Collector Worklist** (`/collector-worklist`) - Daily execution
  - Today's cases, Call history, Promise-to-Pay (PTP)
  - Actions: Call, Record PTP, Record Payment, Mark Escalation
  - Owner: Collector
  - Automation: Broken PTP alerts, Daily performance tracking
  - Control: Collectors cannot alter amounts or close cases

### ⚖ STAGE 6: LEGAL & RESOLUTION
**Pages:**
- **Legal Dashboard** (`/legal`) - Structured escalation
  - Legal-eligible cases, Status (Notice sent, filed, settled)
  - Actions: Generate Legal Notice, Mark Filed, Record Settlement
  - Owner: Legal Officer, Manager, Admin
  - Automation: Legal eligibility based on DPD, Notice templates

### 🧾 STAGE 7: CLOSURE
**Pages:**
- **Loan Closure** (`/closure`) - End lifecycle cleanly
  - Closure Types: Fully paid, Settlement, Write-off
  - Actions: Close Loan, Generate NOC, Archive Case
  - Owner: Operations, Finance, Manager, Admin
  - Control: Closed loans are read-only forever

### 📊 STAGE 8: MIS & CONTROL (COO'S COMMAND CENTER)
**Pages:**
- **MIS Reports Dashboard** (`/mis-reports`) - Decision-making
  - Reports: Portfolio, Aging, Buckets, Collection efficiency, Legal exposure, Collector performance
  - Actions: Filter by date, Export, Drill down
  - Owner: COO, Manager, Admin
  - Automation: Scheduled MIS generation, Alerts on threshold breaches
  - Key Metrics:
    - Total Active Loans
    - Total Outstanding
    - Collection Efficiency %
    - Legal Exposure
    - Bucket-wise distribution
    - Collector performance ranking

### 🔐 SYSTEM-WIDE PAGES
**Pages:**
- **User & Role Management** (`/users`) - Create users, Assign roles, Set limits
- **Audit Log** (`/audit-log`) - Who did what, When, From where
- **Configuration** (`/configuration`) - Product rules, Interest logic, Penalties

## Role-Based Access Control

### Roles & Permissions
```
customer
  - /application
  - /active-loans
  - /loan/:id

telecaller
  - /leads
  - /application
  - /active-loans

credit_analyst
  - /credit-assessment
  - /active-loans
  - /loan/:id

manager
  - All pages except /users, /configuration

operations
  - /disbursement
  - /active-loans
  - /closure
  - /mis-reports

collector
  - /collector-worklist
  - /active-loans
  - /loan/:id

collections_head
  - /collections
  - /active-loans
  - /mis-reports

legal_officer
  - /legal
  - /active-loans
  - /loan/:id

finance
  - /disbursement
  - /active-loans
  - /closure
  - /mis-reports

admin
  - All pages

coo
  - /mis-reports
  - /audit-log
```

## File Structure

```
src/
├── config/
│   └── pages.config.js          # Page definitions & navigation
├── pages/
│   ├── Leads.jsx                # Stage 1
│   ├── Application.jsx          # Stage 1
│   ├── CreditManagement.jsx     # Stage 2
│   ├── Approval.jsx             # Stage 2
│   ├── Disbursement.jsx         # Stage 3
│   ├── ActiveLoans.jsx          # Stage 4
│   ├── LoanDetail.jsx           # Stage 4
│   ├── Collections.jsx          # Stage 5 (CRITICAL)
│   ├── Collector/
│   │   └── MyCases.jsx          # Stage 5
│   ├── Legal/
│   │   └── LegalDashboard.jsx   # Stage 6
│   ├── CaseClosure.jsx          # Stage 7
│   ├── MISReports.jsx           # Stage 8 (COO)
│   ├── Users.jsx                # System
│   ├── AuditLog.jsx             # System
│   ├── Configuration.jsx        # System
│   └── ...
├── components/
│   ├── ProtectedRoute.jsx       # Role-based access
│   ├── Layout/
│   │   └── ModernLayout.jsx     # Main layout
│   └── ...
├── App-production.jsx           # Main router with all routes
└── main.jsx                     # Entry point
```

## Key Features

### 1. Automated Workflows
- DPD calculation (daily)
- Bucketing
- EMI schedules
- Reminders
- MIS aggregation
- Escalation triggers

### 2. Control Points
- Lead: No money, no approval
- Application: Lock editing after submission
- Approval: Immutable approval record
- Disbursement: Accounting event, cannot be undone
- Collections: Collectors cannot alter amounts
- Closure: Read-only forever

### 3. Audit & Compliance
- All actions logged
- No silent edits
- Role-based access
- Immutability guards

## COO's Command Center Checklist

The system answers these instantly:

1. **How much money is at risk today?**
   - MIS Reports → Portfolio → At Risk (>0 DPD)

2. **Who owns every overdue case?**
   - Collections Dashboard → Collector Performance

3. **What will default next week?**
   - MIS Reports → Aging Analysis

4. **Which collector is underperforming?**
   - MIS Reports → Collector Performance Ranking

5. **Which rule caused maximum losses?**
   - Audit Log → Filter by action

## Navigation Structure

```
Dashboard (/)
├── STAGE 1: LEAD & APPLICATION
│   ├── Leads (/leads)
│   └── Application (/application)
├── STAGE 2: CREDIT & RISK
│   ├── Credit Assessment (/credit-assessment)
│   └── Approval (/approval)
├── STAGE 3: DISBURSEMENT
│   └── Disbursement Queue (/disbursement)
├── STAGE 4: REPAYMENT
│   ├── Active Loans (/active-loans)
│   └── Loan 360 View (/loan/:id)
├── STAGE 5: COLLECTIONS
│   ├── Collections Dashboard (/collections)
│   └── My Cases (/collector-worklist)
├── STAGE 6: LEGAL
│   └── Legal Dashboard (/legal)
├── STAGE 7: CLOSURE
│   └── Loan Closure (/closure)
├── STAGE 8: MIS & CONTROL
│   └── MIS Reports (/mis-reports)
└── SYSTEM
    ├── Users (/users)
    ├── Audit Log (/audit-log)
    └── Configuration (/configuration)
```

## Implementation Status

✅ Page Configuration (pages.config.js)
✅ Main Router (App-production.jsx)
✅ Protected Routes (ProtectedRoute.jsx)
✅ Leads Page (Stage 1)
✅ Application Page (Stage 1)
✅ Credit Assessment Page (Stage 2)
✅ Collections Dashboard (Stage 5 - CRITICAL)
✅ MIS Reports (Stage 8 - COO)
✅ All Stub Pages (Stages 3, 4, 6, 7 + System)

## Next Steps

1. Implement detailed pages for each stage
2. Connect to backend APIs
3. Add real-time updates
4. Implement automation triggers
5. Add export/reporting features
6. Mobile responsiveness
7. Performance optimization

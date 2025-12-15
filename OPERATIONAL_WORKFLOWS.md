# 🎯 Operational Workflows - Complete Implementation Guide

## Overview

This document describes the complete operational workflows for the CRM system, including:
1. Screen-by-screen UI flow for each role
2. Collector psychology and incentive alignment
3. Dispute handling workflow
4. Bank reconciliation process

---

## 🔐 PART 1: LOGIN & ROLE-BASED ROUTING

### Login Screen
**Purpose**: Fast, zero-distraction authentication

**Fields**:
- Mobile / Email
- Password
- Remember me (optional)

**Logic**:
```
1. User enters credentials
2. System validates
3. Role auto-detected from User model
4. Redirect based on role:
   - COLLECTOR → Collector Dashboard
   - MANAGER → Manager Dashboard
   - LEGAL → Legal Dashboard
   - ADMIN → Admin Dashboard
```

**No marketing. No clutter. This is an ops tool.**

---

## 🏠 PART 2: ROLE-BASED DASHBOARDS

### 👤 COLLECTOR DASHBOARD

**Purpose**: Tell the collector what to do today.

**Widgets (Top → Bottom)**:

| Widget | Purpose | Data |
|--------|---------|------|
| Today's Due Count | How many cases due today | Count of loans with nextDueDate = today |
| Overdue Count | How many cases overdue | Count of loans with nextDueDate < today |
| Highest DPD Case | Most urgent case | Loan with max DPD |
| Total Collected Today | Daily achievement | Sum of payments today |
| Promises Due Today | Follow-ups needed | Count of promises with promiseDate = today |

**Primary CTA**: 
```
👉 START CALLING
→ Opens "My Cases" screen
```

**Why this works**:
- Collector sees exactly what to do
- No ambiguity
- Immediate action path
- Psychological win: "I have 5 cases due today"

---

### 🧑💼 MANAGER DASHBOARD

**Purpose**: Show risk movement.

**Widgets**:

| Widget | Purpose | Data |
|--------|---------|------|
| Bucket-wise Loan Count | Portfolio distribution | Count by DPD bucket |
| Bucket-wise Amount | Risk exposure | Sum by DPD bucket |
| Fresh Slippages | New overdue today | Loans that moved to overdue today |
| Collector Performance | Team health | Top/bottom performers |
| Legal Inflow | Escalation rate | Count of cases moved to legal this week |

**CTAs**:
- Assign / Reassign cases
- View bucket drill-down
- Escalate to legal

**Why this works**:
- Manager sees portfolio health
- Can spot trends
- Can intervene early
- Data-driven decisions

---

### 🛡️ LEGAL DASHBOARD

**Purpose**: Track enforcement.

**Widgets**:

| Widget | Purpose | Data |
|--------|---------|------|
| New Legal Cases (90+) | Incoming cases | Count of loans moved to legal today |
| Notices Sent | Enforcement progress | Count of legal notices sent |
| Recoveries via Legal | Enforcement success | Amount recovered through legal |
| Aging Legal Cases | Case age | Oldest legal case age |

**CTAs**:
- View legal case details
- Update notice status
- Record recovery

---

## 📋 PART 3: COLLECTOR CORE SCREEN - "MY CASES"

**This is the most important screen in your CRM.**

### Screen Layout

```
┌─────────────────────────────────────────────────────────┐
│ My Cases (Sorted by Priority - Cannot Reorder)          │
├─────────────────────────────────────────────────────────┤
│ Customer Name | Loan ID | EMI | Due Date | DPD | Bucket │
├─────────────────────────────────────────────────────────┤
│ Rajesh Kumar  | LN-001  | 8.5K| 2024-01-15| 0  | 0-15   │ ← Call
│ Priya Singh   | LN-002  | 6.2K| 2024-01-10| 5  | 0-15   │ ← Call
│ Amit Patel    | LN-003  | 12K | 2023-12-20| 22 | 15-30  │ ← Call
│ Neha Sharma   | LN-004  | 5.2K| 2024-01-18| 0  | 0-15   │ ← Call
└─────────────────────────────────────────────────────────┘
```

### Sorting Logic (Automatic - Collector Cannot Reorder)

**Priority Order**:
1. **Due Today** (highest priority)
2. **Highest DPD** (most urgent)
3. **Promise Date Today** (follow-ups)
4. **Amount High → Low** (value)

**Why automatic sorting**:
- Prevents collector gaming the system
- Ensures fairness
- Focuses on real urgency
- Removes decision fatigue

### Each Row Shows

| Field | Purpose | Example |
|-------|---------|---------|
| Customer Name | Identity | Rajesh Kumar |
| Loan ID | Reference | LN-2024-001 |
| EMI Amount | Payment due | ₹8,500 |
| Due Date | When due | 2024-01-15 |
| DPD | Days past due (RED if overdue) | 0 / 22 |
| Bucket | Risk category | 0-15 / 15-30 / 30-60 / 60+ |
| Last Remark | Context | "Promised 15th" |
| Call Button | Action | 📞 |

---

## 📄 PART 4: LOAN DETAIL SCREEN

**Opened when collector clicks a case.**

### Section 1: Loan Snapshot (Top)

```
┌─────────────────────────────────────────────────────────┐
│ Loan Amount: ₹2,50,000                                  │
│ EMI: ₹8,500                                             │
│ Outstanding: ₹1,45,000                                  │
│ DPD: 22 days (RED)                                      │
│ Bucket: 15-30 DPD                                       │
│ Next Due Date: 2024-01-15                               │
└─────────────────────────────────────────────────────────┘
```

### Section 2: Installment Timeline

**Visual list of 14 EMIs**:
```
✓ Jan 2023 - Paid (Green)
✓ Feb 2023 - Paid (Green)
✓ Mar 2023 - Paid (Green)
⏳ Apr 2023 - Pending (Yellow)
⏳ May 2023 - Pending (Yellow)
✗ Jun 2023 - Overdue (Red)
✗ Jul 2023 - Overdue (Red)
```

### Section 3: Payment History

| Date | Amount | Mode | Penalty | Reference |
|------|--------|------|---------|-----------|
| 2024-01-10 | ₹8,500 | Bank Transfer | ₹0 | UTR-123456 |
| 2023-12-15 | ₹8,500 | Bank Transfer | ₹500 | UTR-123455 |
| 2023-11-15 | ₹8,500 | Bank Transfer | ₹0 | UTR-123454 |

### Section 4: Actions

**Collector can**:
- Record Payment
- Add Remark
- Set Promise to Pay

**Collector CANNOT**:
- Edit schedule
- Edit amounts
- Adjust penalties
- Change terms

**Why this matters**:
- Collector focuses on collection
- System handles math
- No disputes over calculations

---

## 💸 PART 5: RECORD PAYMENT SCREEN

**Fields**:
```
Amount: [Input]
Mode: [Dropdown: Bank Transfer, Cash, Cheque, etc.]
Date: [Date Picker]
Reference / UTR: [Input]
Optional Note: [Text Area]
```

**On Submit, CRM Automatically**:
1. Allocates payment to oldest EMI
2. Applies penalty if late
3. Updates EMI status
4. Recalculates DPD
5. Updates bucket
6. Refreshes dashboards
7. Sends confirmation to customer

**Collector never touches math.**

---

## ⏰ PART 6: PROMISE TO PAY SCREEN

**Fields**:
```
Promise Date: [Date Picker]
Expected Amount: [Input]
Remark: [Text Area]
```

**CRM Automatically**:
1. Adds reminder (SMS/Email)
2. Re-prioritizes case on that date
3. Tracks broken promises (KPI)
4. Flags if promise is broken

**Why this matters**:
- Collector commits to follow-up
- System enforces accountability
- Broken promises are tracked
- Incentive alignment

---

## ⚠️ PART 7: BUCKET VIEW (MANAGER)

**Bucket-wise Lists**:

```
0-15 DPD:   245 cases | ₹45.2L
15-30 DPD:  89 cases  | ₹18.5L
30-60 DPD:  34 cases  | ₹8.2L
60+ DPD:    12 cases  | ₹3.1L
90+ (Legal): 5 cases  | ₹1.2L
```

**Manager Can**:
- Reassign cases
- Escalate priority
- Move to legal (if system allows)
- View drill-down

---

## ⚖️ PART 8: LEGAL CASE SCREEN

**Collectors no longer see these cases.**

**Shows**:
- Loan details
- Legal status
- Notice dates
- Hearing dates
- Recovery amounts
- Final outcome

---

## 🧠 PART 9: COLLECTOR PSYCHOLOGY & INCENTIVE ALIGNMENT

### What Collectors Want

✅ Clear daily target  
✅ Clear priority  
✅ Immediate feedback  
✅ No blame for system errors  

### What Demotivates Them

❌ Manual calculations  
❌ Disputes after payment  
❌ Changing rules  
❌ Targets without context  

### Incentive Logic (Recommended)

**Metrics to Track**:

| Metric | Weight | Why |
|--------|--------|-----|
| Collections on Due Date | 40% | Prevents slippage |
| Early Recovery (1-7 DPD) | 30% | Saves money |
| Broken Promise Rate | -20% | Accountability |
| Calls vs Payments Ratio | 10% | Efficiency |
| Bucket Movement Direction | 10% | Portfolio health |

**Improving = Reward**  
**Deteriorating = Warning**

### What NOT to Incentivize

❌ Total amount collected alone (encourages late recoveries)  
❌ Late recoveries (should be minimized)  
❌ Legal recoveries (expensive)  

### CRM Support for Psychology

**Show**:
- "You saved X cases today"
- "You prevented Y from slipping to next bucket"
- "You're #1 in early recoveries this week"

**Collectors should feel like problem-solvers, not beggars.**

---

## 🚨 PART 10: DISPUTE HANDLING WORKFLOW

### Types of Disputes

1. **"I already paid"** → Payment duplicate
2. **"Amount is wrong"** → Amount mismatch
3. **"Penalty not applicable"** → Penalty invalid
4. **"Collector misbehaved"** → Collector behavior
5. **"Loan terms unclear"** → Loan terms

### Dispute Workflow

#### Step 1: Raise Dispute

```
Collector or Customer raises dispute
├─ Select type
├─ Add note
├─ Attach proof (screenshot, statement)
└─ Loan status becomes: DISPUTE_PAYMENT_HOLD
```

#### Step 2: Dispute Review (Manager/Admin)

```
Manager reviews:
├─ Payment logs
├─ Bank records
├─ Call logs
└─ System calculations
```

#### Step 3: Resolution

**Options**:
- Accept payment → adjust schedule
- Reject claim → explain reason
- Waive penalty (admin-only)
- Correct mapping error

#### Step 4: Close Dispute

```
Add resolution note
├─ Resume normal DPD flow
├─ Notify collector
└─ Notify customer
```

**No silent fixes. Everything auditable.**

---

## 🏦 PART 11: BANK RECONCILIATION & MISMATCH HANDLING

### Daily Bank Reconciliation Flow

#### Step 1: Upload Bank Statement

```
CSV / Excel
├─ Date range
├─ Account
└─ Transactions
```

#### Step 2: Auto-Matching

**System matches**:
- UTR
- Amount
- Date (±1 day)
- Mode

**Result**:
- Matched → auto-approved
- Unmatched → manual review

#### Step 3: Mismatch Buckets

**A. Bank Paid, CRM Missing**
```
Auto-create "Unlinked Payment"
└─ Sent to admin queue
```

**B. CRM Paid, Bank Missing**
```
Mark as "Pending Bank Confirmation"
└─ Freeze DPD temporarily
```

**C. Amount Mismatch**
```
Flag for review
├─ Attach bank row
└─ Attach CRM row
```

#### Step 4: Manual Resolution

**Admin can**:
- Link payment to loan
- Correct amount
- Reject fake entry
- Escalate fraud alert

#### Step 5: Finalize Day

```
Once reconciled:
├─ Lock the day
├─ Generate daily MIS
└─ Collector performance finalized
```

**No retroactive silent changes allowed.**

---

## 📊 PART 12: DATA MODELS

### Dispute Model
```javascript
{
  loanId,
  customerId,
  type: 'PAYMENT_DUPLICATE' | 'AMOUNT_MISMATCH' | 'PENALTY_INVALID' | 'COLLECTOR_BEHAVIOR' | 'LOAN_TERMS',
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CLOSED',
  description,
  attachments: [URLs],
  raisedBy: 'COLLECTOR' | 'CUSTOMER' | 'SYSTEM',
  resolution: { action, note, resolvedBy, resolvedAt },
  auditLog: [{ action, user, timestamp, details }]
}
```

### Bank Reconciliation Model
```javascript
{
  reconciliationDate,
  account,
  status: 'PENDING' | 'IN_PROGRESS' | 'RECONCILED' | 'LOCKED',
  transactions: [{
    bankUTR,
    bankAmount,
    bankDate,
    crmPaymentId,
    matchStatus: 'MATCHED' | 'UNLINKED_PAYMENT' | 'PENDING_CONFIRMATION' | 'AMOUNT_MISMATCH' | 'FRAUD_ALERT',
    resolution: { action, linkedLoanId, resolvedBy, resolvedAt }
  }],
  summary: { totalBankAmount, totalCRMAmount, matchedCount, unmatchedCount, discrepancyAmount },
  lockedAt,
  lockedBy,
  auditLog: [{ action, user, timestamp, details }]
}
```

### Promise to Pay Model
```javascript
{
  loanId,
  customerId,
  promiseDate,
  expectedAmount,
  remark,
  status: 'PENDING' | 'FULFILLED' | 'BROKEN' | 'PARTIALLY_FULFILLED',
  createdBy,
  fulfillmentDetails: { paymentId, amountReceived, fulfillmentDate },
  reminderSent,
  brokenPromiseTracking: { isBroken, brokenAt, reason },
  auditLog: [{ action, user, timestamp, details }]
}
```

### Collector Performance Model
```javascript
{
  collectorId,
  date,
  metrics: {
    casesAssigned,
    casesWorked,
    callsMade,
    paymentsReceived,
    amountCollected,
    promisesSet,
    promisesFulfilled,
    promisesBroken,
    casesMovedToLegal,
    casesImproved,
    casesDeteriorated
  },
  kpis: {
    collectionOnDueDate: %,
    earlyRecoveryRate: %,
    brokenPromiseRate: %,
    callToPaymentRatio,
    bucketMovementScore
  },
  incentiveEligible: boolean,
  incentiveAmount,
  warnings: [strings],
  auditLog: [{ action, user, timestamp, details }]
}
```

---

## 🎯 FINAL THOUGHT

What you're building is not a CRM.

It is a **behavior-shaping system**:
- For collectors (clarity, fairness, incentives)
- For customers (transparency, respect)
- For managers (visibility, control)
- For legal (enforcement, tracking)
- For finance (reconciliation, truth)

**Together, these flows ensure**:
✅ Collectors focus on action, not math  
✅ Managers see risk, not noise  
✅ Legal triggers are automatic  
✅ Disputes don't become chaos  
✅ Bank truth and CRM truth converge  
✅ Your business scales without burning trust  

---

**Version**: 1.0.0  
**Status**: Complete  
**Ready for Implementation**: YES

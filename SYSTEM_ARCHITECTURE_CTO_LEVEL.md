# System Architecture - CTO/COO Level
## Loan Management as a State Machine

---

## 1️⃣ SYSTEM ARCHITECTURE (WHY THIS SHAPE)

### Core Principle
**Loans are state machines, not records.**

The system is event-driven. Every action transitions a loan through defined states. This prevents silent corruption and ensures auditability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Role-Based UI)             │
│  Sales | Credit | Manager | Ops | Collector | COO      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              API GATEWAY (Auth + RBAC)                  │
│  - JWT Validation                                       │
│  - Role-based access control                            │
│  - Request logging                                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           DOMAIN SERVICES (Business Logic)              │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │ Loan Service │ Credit Svc   │ Disburse Svc │         │
│  ├──────────────┼──────────────┼──────────────┤         │
│  │ Collection   │ Legal Svc    │ MIS Svc      │         │
│  └──────────────┴──────────────┴──────────────┘         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         DATABASE (Source of Truth)                      │
│  Loans | Installments | Payments | Collections | Audit  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│      SCHEDULERS / WORKERS (Automation)                  │
│  DPD Engine | Bucket Assignment | Reminders | Escalation│
└─────────────────────────────────────────────────────────┘
```

### Why This Shape?

| Layer | Responsibility | Why Separate? |
|-------|-----------------|---------------|
| Frontend | Display state, collect input | Role-based UI differs |
| API Gateway | Auth, RBAC, logging | Security boundary |
| Services | Business logic | Each service owns one domain |
| Database | Persistent truth | Single source of truth |
| Schedulers | Automation | Runs independently |

**Key Rule:** Each layer has ONE job only. No mixing.

---

## 2️⃣ LOAN AS A STATE MACHINE (MOST IMPORTANT)

### Canonical Loan States

```
LEAD
  ↓
APPLICATION_SUBMITTED
  ↓
CREDIT_REVIEW
  ↓
APPROVED
  ↓
DISBURSED
  ↓
ACTIVE
  ├─→ DELINQUENT (if DPD > 0)
  │     ├─→ ACTIVE (if payment clears)
  │     └─→ LEGAL (if DPD ≥ threshold)
  │
  └─→ CLOSED (if fully paid)

LEGAL
  ├─→ ACTIVE (if settled)
  └─→ CLOSED (if resolved)
```

### ⚠️ States Are Immutable Transitions

**You never "edit" a loan into a new state.**

```javascript
// ❌ WRONG - Direct mutation
loan.state = 'APPROVED';
loan.save();

// ✅ RIGHT - Transition with rules
loanService.transition(loanId, 'APPROVED', {
  approvedBy: userId,
  approvalAmount: amount,
  conditions: [...],
  timestamp: now
});
```

This prevents silent corruption.

### State Transition Rules (Enforced in Backend)

| From | To | Who | Condition | Action |
|------|----|----|-----------|--------|
| APPLICATION_SUBMITTED | CREDIT_REVIEW | System | Submit | Trigger credit check |
| CREDIT_REVIEW | APPROVED | Manager | Approval | Record decision |
| CREDIT_REVIEW | REJECTED | Manager | Rejection | Notify customer |
| APPROVED | DISBURSED | Ops | Bank verified | Generate schedule |
| DISBURSED | ACTIVE | System | First EMI due | Start collections |
| ACTIVE | DELINQUENT | System | DPD > 0 | Trigger reminders |
| DELINQUENT | ACTIVE | System | Payment clears | Resume normal |
| DELINQUENT | LEGAL | System | DPD ≥ 90 | Escalate |
| ACTIVE/LEGAL | CLOSED | Ops | Full payment | Archive |

**These rules live in backend logic, not frontend.**

---

## 3️⃣ BACKEND TECH FLOW (IN DEPTH)

### A. Core Services (DO NOT MIX RESPONSIBILITIES)

#### 1. Auth & RBAC Service

**Purpose:** Who can do what.

```javascript
// Responsibilities
- JWT validation
- Session management
- Role-based access control
- Approval limits per role
- Audit logging

// This service NEVER knows loan logic
// It only knows: User → Role → Permissions
```

**Key APIs:**
```
POST   /auth/login
POST   /auth/logout
GET    /auth/verify
POST   /auth/refresh
GET    /auth/permissions
```

---

#### 2. Loan Service (THE HEART)

**Purpose:** Owns loan lifecycle.

```javascript
// Responsibilities
- Create loan
- Transition states
- Lock/Unlock actions based on state
- Maintain invariants
- Record all changes

// Invariants (enforced)
- Cannot disburse unless approved
- Cannot close unless outstanding = 0
- Cannot modify principal after disbursement
- Cannot transition to invalid states
```

**Key APIs:**
```
POST   /loans                    // Create
GET    /loans/:id                // Fetch
POST   /loans/:id/transition     // State change
GET    /loans/:id/history        // Audit trail
POST   /loans/:id/lock           // Prevent changes
```

**Example: Transition Logic**
```javascript
async transition(loanId, newState, context) {
  const loan = await Loan.findById(loanId);
  
  // Validate transition
  if (!isValidTransition(loan.state, newState)) {
    throw new Error(`Cannot go from ${loan.state} to ${newState}`);
  }
  
  // Check permissions
  if (!hasPermission(context.user, newState)) {
    throw new Error('Insufficient permissions');
  }
  
  // Execute transition
  loan.previousState = loan.state;
  loan.state = newState;
  loan.stateChangedAt = new Date();
  loan.stateChangedBy = context.user.id;
  
  // Side effects
  await this.triggerSideEffects(loan, newState);
  
  // Audit
  await AuditLog.create({
    entity: 'Loan',
    entityId: loanId,
    action: 'STATE_TRANSITION',
    before: { state: loan.previousState },
    after: { state: newState },
    userId: context.user.id,
    timestamp: new Date()
  });
  
  return loan.save();
}
```

---

#### 3. Credit Service

**Purpose:** Risk evaluation.

```javascript
// Responsibilities
- FOIR calculation
- Rule checks
- Risk band assignment
- Recommendation generation

// Does NOT
- Approve (Manager does)
- Change loan amount
- Make decisions

// Returns recommendations, not decisions
```

**Key APIs:**
```
POST   /credit/evaluate          // Evaluate application
GET    /credit/rules             // Get active rules
POST   /credit/rules             // Create rule
```

---

#### 4. Disbursement Service

**Purpose:** Money movement (controlled).

```javascript
// Responsibilities
- Bank validation
- Disbursement recording
- Repayment schedule generation
- Installment creation

// Triggers
- Installment creation
- Loan state → ACTIVE
- Schedule generation
```

**Key APIs:**
```
POST   /disbursement/verify      // Verify bank details
POST   /disbursement/disburse    // Execute disbursement
GET    /disbursement/:id/status  // Check status
```

---

#### 5. Installment & Payment Service

**Purpose:** Time-based obligations.

```javascript
// Installment Model (Standalone)
{
  _id: ObjectId,
  loanId: ObjectId,
  installmentNumber: 1,
  dueDate: Date,
  dueAmount: Number,
  paidAmount: Number,
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE',
  dpd: Number,
  createdAt: Date,
  updatedAt: Date
}

// Payment Flow
Payment received
  → Allocated to oldest unpaid installment
  → Update paidAmount
  → Recalculate outstanding
  → Possibly reduce DPD
  → Update loan state if needed
```

**Key APIs:**
```
GET    /installments?loanId=X    // Get installments
POST   /payments                 // Record payment
GET    /payments/:id             // Fetch payment
```

---

#### 6. Collections Service

**Purpose:** Recover money.

```javascript
// Responsibilities
- Assign collectors
- Track Promise-to-Pay (PTP)
- Record collection actions
- Calculate collector metrics

// Does NOT
- Do accounting
- Modify payments
- Change loan state

// Only records intent and effort
```

**Key APIs:**
```
POST   /collections/assign       // Assign to collector
POST   /collections/ptp          // Record PTP
POST   /collections/action       // Log call/SMS/visit
GET    /collections/metrics      // Collector performance
```

---

#### 7. Legal Service

**Purpose:** Escalation, not recovery.

```javascript
// Responsibilities
- Legal eligibility check
- Notice generation
- Case tracking
- Settlement recording

// Does NOT
- Recover money
- Modify loans
- Change states
```

**Key APIs:**
```
POST   /legal/cases              // Create case
GET    /legal/cases/:id          // Fetch case
POST   /legal/cases/:id/settle   // Record settlement
```

---

#### 8. MIS / Reporting Service

**Purpose:** Read-only truth.

```javascript
// CRITICAL RULE
// MIS never mutates data
// It only aggregates

// Aggregates from
- Loans
- Installments
- Payments
- Collections
- Legal cases

// Calculates
- Portfolio metrics
- Bucket distribution
- Collection efficiency
- Aging analysis
- Legal metrics
```

**Key APIs:**
```
GET    /reports/portfolio        // Portfolio summary
GET    /reports/buckets          // Bucket distribution
GET    /reports/efficiency       // Collection efficiency
GET    /reports/aging            // Aging analysis
GET    /reports/legal            // Legal metrics
GET    /reports/collectors       // Collector performance
```

---

## 4️⃣ FRONTEND TECH FLOW (ROLE-DRIVEN)

### Frontend is NOT CRUD

**It is a state-restricted command console.**

### Page → Allowed Actions Mapping

**Example: Loan Detail Page**

Backend returns:
```json
{
  "loan": {
    "id": "L123",
    "state": "DELINQUENT",
    "principal": 100000,
    "outstanding": 25000,
    "dpd": 45
  },
  "allowedActions": [
    "RECORD_PAYMENT",
    "ADD_PTP",
    "ESCALATE_TO_LEGAL",
    "VIEW_HISTORY"
  ]
}
```

Frontend:
```javascript
// Show only allowed buttons
{allowedActions.includes('RECORD_PAYMENT') && <PaymentButton />}
{allowedActions.includes('ADD_PTP') && <PTPButton />}
{allowedActions.includes('ESCALATE_TO_LEGAL') && <EscalateButton />}

// Disable everything else
<button disabled={!allowedActions.includes('RECORD_PAYMENT')}>
  Record Payment
</button>
```

This prevents human error.

### Role-Based UI Rules

| Role | Sees | Can Act | Cannot See |
|------|------|---------|-----------|
| Sales | Leads, Applications | Create, Follow-up | Payments, Collections |
| Credit | Credit pages | Recommend only | Payments, Collections |
| Manager | Approval pages | Approve/Reject | Payments, Collections |
| Ops | Disbursement | Disburse | Collections, Legal |
| Collector | Assigned cases | Call, PTP, Payment | Approval, Disbursement |
| Legal | Legal cases | Create case, Settle | Payments, Collections |
| COO | MIS Reports | Read-only | Operational pages |

**Frontend never decides permissions.**
**Backend declares reality.**

---

## 5️⃣ AUTOMATION & SCHEDULERS (SYSTEM AS EMPLOYEE)

This is where your system becomes alive.

### Daily Jobs (Cron / Workers)

#### 1. DPD Engine (Daily Midnight)

```javascript
// For each installment
for (const installment of installments) {
  if (installment.dueDate < today && installment.status !== 'PAID') {
    // Increment DPD
    installment.dpd = Math.floor((today - installment.dueDate) / 86400000);
    
    // Update loan DPD
    const loan = await Loan.findById(installment.loanId);
    loan.dpd = Math.max(...loan.installments.map(i => i.dpd));
    
    // Trigger state transitions
    if (loan.state === 'ACTIVE' && loan.dpd > 0) {
      await loanService.transition(loan._id, 'DELINQUENT', {
        reason: 'DPD > 0',
        system: true
      });
    }
    
    if (loan.dpd >= 90 && loan.state === 'DELINQUENT') {
      await loanService.transition(loan._id, 'LEGAL', {
        reason: 'DPD >= 90',
        system: true
      });
    }
  }
}
```

#### 2. Bucket Assignment (Daily)

```javascript
// Uses DPD only
for (const loan of loans) {
  let bucket;
  
  if (loan.dpd === 0) bucket = 'CURRENT';
  else if (loan.dpd <= 30) bucket = 'X';
  else if (loan.dpd <= 60) bucket = 'Y';
  else if (loan.dpd <= 90) bucket = 'Z';
  else bucket = 'LEGAL';
  
  loan.bucket = bucket;
  await loan.save();
}
```

#### 3. Reminder Engine (Daily)

```javascript
// Upcoming EMI (5 days before)
const upcomingInstallments = await Installment.find({
  dueDate: { $gte: today, $lte: today + 5 days },
  status: { $ne: 'PAID' }
});

for (const inst of upcomingInstallments) {
  await sendReminder(inst.loanId, 'UPCOMING_EMI', inst);
}

// Overdue reminders (daily)
const overdueInstallments = await Installment.find({
  dueDate: { $lt: today },
  status: { $ne: 'PAID' }
});

for (const inst of overdueInstallments) {
  await sendReminder(inst.loanId, 'OVERDUE', inst);
}

// Broken PTP alerts
const brokenPTPs = await PTP.find({
  promiseDate: { $lt: today },
  status: 'PENDING'
});

for (const ptp of brokenPTPs) {
  await escalateToManager(ptp.loanId, 'BROKEN_PTP');
}
```

#### 4. Escalation Engine

```javascript
// DPD >= X → Collection
for (const loan of loans) {
  if (loan.dpd >= 30 && !loan.collectorId) {
    await collectionService.assign(loan._id, getAvailableCollector());
  }
}

// DPD >= Y → Legal
for (const loan of loans) {
  if (loan.dpd >= 90 && loan.state !== 'LEGAL') {
    await loanService.transition(loan._id, 'LEGAL', {
      reason: 'Auto-escalation',
      system: true
    });
  }
}
```

**No human forgetfulness allowed.**

---

## 6️⃣ DATA INTEGRITY, AUDIT & CONTROL

### Non-Negotiable Tech Rules

#### 1. Append-Only Audit Logs

```javascript
// Every action recorded
{
  _id: ObjectId,
  entity: 'Loan' | 'Payment' | 'Collection',
  entityId: ObjectId,
  action: 'CREATE' | 'UPDATE' | 'STATE_TRANSITION' | 'DELETE',
  before: { /* previous state */ },
  after: { /* new state */ },
  userId: ObjectId,
  userRole: 'Manager' | 'Ops' | 'Collector',
  timestamp: Date,
  ipAddress: String,
  userAgent: String
}
```

**Never delete audit logs.**

#### 2. Soft Deletes Only

```javascript
// Never hard-delete
// ❌ WRONG
await Loan.deleteOne({ _id: loanId });

// ✅ RIGHT
await Loan.updateOne(
  { _id: loanId },
  { deletedAt: new Date(), deletedBy: userId }
);
```

#### 3. Financial Immutability

```javascript
// Payments never edited
// ❌ WRONG
await Payment.updateOne(
  { _id: paymentId },
  { amount: newAmount }
);

// ✅ RIGHT - Create reversal
await Payment.create({
  loanId: payment.loanId,
  type: 'REVERSAL',
  amount: -payment.amount,
  originalPaymentId: paymentId,
  reason: 'Correction',
  createdBy: userId
});

// Then create new payment
await Payment.create({
  loanId: payment.loanId,
  type: 'PAYMENT',
  amount: correctAmount,
  createdBy: userId
});
```

This protects you legally.

---

## 7️⃣ HOW MANAGEMENT CONTROLS THE BUSINESS (REAL POWER)

### From MIS, COO Can:

```javascript
// 1. Freeze disbursements if risk spikes
if (portfolio.riskMetrics.defaultRate > 0.15) {
  await loanService.freezeDisbursements();
  await notifyManagement('Risk threshold exceeded');
}

// 2. Change escalation thresholds
await updateConfig({
  escalationThreshold: 60, // was 90
  collectionThreshold: 15  // was 30
});

// 3. Track collector ROI
const collectorMetrics = await reportService.getCollectorPerformance();
// {
//   collectorId: 'C123',
//   casesAssigned: 150,
//   casesResolved: 120,
//   amountCollected: 5000000,
//   roi: 3.33
// }

// 4. Predict cash inflow
const cashFlow = await reportService.predictCashFlow(30); // next 30 days
// {
//   day1: 500000,
//   day2: 750000,
//   ...
//   total: 15000000
// }

// 5. Identify leakage early
const leakage = await reportService.findLeakage();
// {
//   brokenPTPs: 45,
//   unassignedCases: 23,
//   stalledCases: 12,
//   estimatedLoss: 2500000
// }
```

**Because:**
- Data is consistent (state machine)
- States are enforced (no manual edits)
- Automation is relentless (no human error)
- Audit logs never lie (complete history)

---

## 8️⃣ WHY THIS DESIGN SURVIVES SCALE

### Humans Are Error-Prone

```
Manual state changes → Silent corruption
Manual calculations → Wrong metrics
Manual reminders → Forgotten cases
Manual escalations → Delayed action
```

### States Are Not

```
Defined transitions → No ambiguity
Enforced rules → No exceptions
Immutable history → Complete audit trail
Automated actions → No human error
```

### This System Scales From:

```
100 loans → 1,000,000 loans
without changing philosophy.

Why?
- State machine logic doesn't change
- Services remain independent
- Schedulers run in parallel
- Database scales horizontally
- Audit logs are append-only
```

---

## 9️⃣ IMPLEMENTATION CHECKLIST

### Backend Services

- [ ] Auth & RBAC Service
- [ ] Loan Service (state machine)
- [ ] Credit Service
- [ ] Disbursement Service
- [ ] Installment & Payment Service
- [ ] Collections Service
- [ ] Legal Service
- [ ] MIS / Reporting Service

### Schedulers

- [ ] DPD Engine
- [ ] Bucket Assignment
- [ ] Reminder Engine
- [ ] Escalation Engine

### Data Integrity

- [ ] Audit logging
- [ ] Soft deletes
- [ ] Financial immutability
- [ ] Transaction handling

### Frontend

- [ ] Role-based UI
- [ ] Allowed actions display
- [ ] State-restricted commands
- [ ] Real-time updates

---

## 🔟 MONITORING & OBSERVABILITY

### Key Metrics to Track

```javascript
// System Health
- API response time (p50, p95, p99)
- Error rate by service
- Database query performance
- Scheduler execution time

// Business Metrics
- Portfolio growth
- Default rate
- Collection efficiency
- Collector ROI
- Cash flow prediction accuracy

// Data Quality
- Audit log completeness
- State transition validity
- Payment reconciliation
- Bucket accuracy
```

### Alerts to Set

```javascript
// Critical
- Service down
- Database connection lost
- Scheduler failed
- Audit log write failed

// High
- Error rate > 1%
- Response time > 5s
- Default rate > 15%
- Collection efficiency < 80%

// Medium
- Unassigned cases > 50
- Broken PTPs > 20
- Stalled cases > 10
```

---

## 📊 SUMMARY TABLE

| Component | Purpose | Owns | Never Does |
|-----------|---------|------|-----------|
| Auth Service | Access control | Permissions | Business logic |
| Loan Service | Lifecycle | State machine | Accounting |
| Credit Service | Risk eval | Recommendations | Approvals |
| Disbursement | Money movement | Schedules | Accounting |
| Payment Service | Obligations | Installments | Loan state |
| Collections | Recovery | Effort tracking | Accounting |
| Legal Service | Escalation | Cases | Recovery |
| MIS Service | Reporting | Aggregation | Mutations |

---

## 🎯 NEXT STEPS

1. **Implement state machine** in Loan Service
2. **Create schedulers** for automation
3. **Build audit logging** for compliance
4. **Develop role-based UI** for frontend
5. **Set up monitoring** for observability

---

**This is not CRUD. This is a controlled, auditable, scalable system.**

**Every action is a state transition. Every transition is recorded. Every record is immutable.**

**This is how you build systems that survive scale, audit, and complexity.**

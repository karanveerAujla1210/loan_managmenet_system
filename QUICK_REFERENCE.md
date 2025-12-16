# Quick Reference - All New Components

## Models (6)
| Model | Purpose | Key Fields |
|-------|---------|-----------|
| Installment | EMI tracking | loanId, installmentNo, dueDate, status, penalty |
| Dispute | Payment disputes | loanId, reason, status, dpdFrozen |
| AuditLog | Financial audit | action, entity, entityId, userId, changes |
| PromiseToPay | Payment promises | loanId, promisedAmount, promisedDate, status |
| BankReconciliation | Bank matching | utr, amount, status, matchType |
| CollectorPerformance | Weekly scores | userId, weekStartDate, totalScore, incentivePercentage |

## Services (6)
| Service | File | Key Methods |
|---------|------|------------|
| PaymentAllocator | payment-allocator.service.js | allocatePayment() |
| DPDUpdate | dpd-update.service.js | updateAllLoans(), calculateDPD(), assignBucket() |
| CollectorScoring | collector-scoring.service.js | calculateWeeklyScores() |
| MISReport | mis-report.service.js | getPortfolioSnapshot(), getBucketExposure(), etc |
| Dispute | dispute.service.js | createDispute(), resolveDispute() |
| BankReconciliation | bank-reconciliation.service.js | matchPayments(), reconcilePayments(), lockReconciliationDay() |

## Cron Jobs (4)
| Job | Schedule | File | Action |
|-----|----------|------|--------|
| DPD Update | 2:30 AM Daily | dpdUpdateJob.js | Update DPD & buckets |
| Legal Escalation | 2:30 AM Daily | legal-escalation-cron.js | Auto-create legal cases at DPD ≥ 90 |
| Collector Scoring | 3:00 AM Monday | collector-scoring-cron.js | Calculate weekly performance |
| Promise Reminder | 9:00 AM Daily | promise-reminder-cron.js | Remind about pending promises |

## API Routes (15+)
```
POST   /api/v1/disputes                    - Create dispute
GET    /api/v1/disputes/loan/:loanId       - Get disputes
PUT    /api/v1/disputes/:id/resolve        - Resolve dispute

POST   /api/v1/promises                    - Create promise
GET    /api/v1/promises/loan/:loanId       - Get promises
PUT    /api/v1/promises/:id/status         - Update promise

GET    /api/v1/collector-performance       - Get all collectors
GET    /api/v1/collector-performance/:id   - Get collector scores
PUT    /api/v1/collector-performance/:id/approve - Approve

GET    /api/v1/mis/portfolio-snapshot      - Portfolio overview
GET    /api/v1/mis/bucket-exposure         - Bucket exposure
GET    /api/v1/mis/collection-efficiency   - Collection metrics
GET    /api/v1/mis/roll-rate               - Bucket migration
GET    /api/v1/mis/legal-exposure          - Legal metrics

POST   /api/v1/reconciliation-advanced/match     - Match statements
GET    /api/v1/reconciliation-advanced/unmatched - Get unmatched
POST   /api/v1/reconciliation-advanced/reconcile - Reconcile
POST   /api/v1/reconciliation-advanced/lock-day  - Lock day
```

## Frontend Pages (4)
| Page | Route | Role | File |
|------|-------|------|------|
| Disputes | /disputes | manager, admin | pages/Disputes/index.jsx |
| Promises | /promises | collector, manager, admin | pages/Promises/index.jsx |
| Collector Performance | /collector-performance | manager, admin | pages/CollectorPerformance/index.jsx |
| MIS Reports | /reports | manager, admin | pages/MISReports/index.jsx |

## Key Calculations

### DPD Buckets
```
0 days        → CURRENT
1-7 days      → 1-7
8-15 days     → 8-15
16-22 days    → 16-22
23-29 days    → 23-29
30-59 days    → 30+
60-89 days    → 60+
≥90 days      → LEGAL (auto-escalate)
```

### Collector Scoring (100 points)
```
On-time collections:      40 pts (EMIs paid on due date)
Early overdue recovery:   25 pts (1-7 DPD EMIs recovered)
Promise discipline:       15 pts (1 - broken/total promises)
Bucket improvement:       10 pts (loans moved to lower bucket)
Data quality:             10 pts (manual review)
```

### Incentive Payout
```
≥85 points  → 100% incentive
70-84       → 75%
50-69       → 40%
<50         → 0%
```

### Bank Reconciliation Matching
```
Step 1 (EXACT):  UTR + Amount + Date (±1 day)
Step 2 (SEMI):   Amount + Date (±1 day)
Step 3 (LOOSE):  Amount + Date (±2 days)
Unmatched:       Create UNLINKED_PAYMENT
```

### Payment Allocation
```
1. Find first unpaid installment
2. Apply ₹250 penalty if overdue
3. Allocate payment amount
4. Update installment status
5. Recalculate loan outstanding
6. Create audit log
```

## Database Indexes
```
Installment:  loanId + installmentNo (unique), loanId + status
Dispute:      loanId, status
AuditLog:     entityId + createdAt, userId + createdAt, createdAt
PromiseToPay: loanId + status, promisedDate
BankRecon:    statementDate + status, utr
Performance:  userId + weekStartDate, weekStartDate
```

## Environment Variables
```
CRON_ENABLED=true          # Enable/disable cron jobs
NODE_ENV=production        # Environment
MONGODB_URI=...            # Database connection
JWT_SECRET=...             # JWT secret
PORT=5000                  # Server port
```

## Testing Commands

### Create Dispute
```bash
curl -X POST http://localhost:5000/api/v1/disputes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"loanId":"LOAN_ID","reason":"Payment not received"}'
```

### Create Promise
```bash
curl -X POST http://localhost:5000/api/v1/promises \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"loanId":"LOAN_ID","promisedAmount":5000,"promisedDate":"2024-01-15"}'
```

### Get Portfolio Snapshot
```bash
curl -X GET http://localhost:5000/api/v1/mis/portfolio-snapshot \
  -H "Authorization: Bearer TOKEN"
```

### Match Bank Statements
```bash
curl -X POST http://localhost:5000/api/v1/reconciliation-advanced/match \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bankStatements":[...]}'
```

## Troubleshooting

### Cron jobs not running
- Check CRON_ENABLED=true in .env
- Check server logs for cron initialization
- Verify MongoDB connection

### DPD not updating
- Run cron manually: `node scripts/runDPDCron.js`
- Check installment status values (must be PENDING/PARTIAL/OVERDUE)
- Verify loan status is ACTIVE or LEGAL

### Legal cases not created
- Check if DPD ≥ 90
- Verify LegalCase model exists
- Check audit logs for errors

### Collector scores not calculated
- Verify cron runs on Monday 3:00 AM
- Check if loans have assignedAgent
- Verify installment data exists

### Bank reconciliation not matching
- Check UTR format consistency
- Verify date ranges (±1 or ±2 days)
- Check amount precision (no decimals)

## Files Modified
- app.js (added routes)
- server.js (added cron jobs)
- routes.jsx (added pages & guards)

## Files Created (20+)
- 6 Models
- 6 Services
- 4 Cron Jobs
- 5 Route Files
- 1 Middleware
- 4 Frontend Pages
- 1 Guard Component
- 2 Documentation Files

# IMPLEMENTATION GUIDE – Technical Operating Spec

**How to implement the Technical Operating Specification**

---

## Phase 1: Core Infrastructure

### 1.1 Middleware Stack

**File:** `backend/src/middlewares/index.js`

```javascript
// Order matters!
app.use(requestLogger);
app.use(authMiddleware);
app.use(rbacMiddleware);
app.use(stateGuardMiddleware);
app.use(validationMiddleware);
app.use(errorHandler);
```

### 1.2 Response Envelope

**File:** `backend/src/utils/response.js`

```javascript
const success = (data, meta = {}) => ({
  success: true,
  data,
  error: null,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta
  }
});

const error = (code, message, details = {}) => ({
  success: false,
  data: null,
  error: { code, message, details },
  meta: { timestamp: new Date().toISOString() }
});

module.exports = { success, error };
```

### 1.3 Error Handler

**File:** `backend/src/middlewares/errorHandler.js`

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    data: null,
    error: { code, message, details: err.details || {} },
    meta: { timestamp: new Date().toISOString() }
  });
};

module.exports = errorHandler;
```

---

## Phase 2: Domain Implementation

### 2.1 Loans Domain (State Machine)

**File:** `backend/src/domains/loans/loan.controller.js`

```javascript
const transitionLoan = async (req, res) => {
  const { id } = req.params;
  const { action, metadata } = req.body;

  // Get current loan
  const loan = await Loan.findById(id);
  if (!loan) return res.status(404).json(error('LOAN_NOT_FOUND', 'Loan not found'));

  // Check if action valid in current state
  const allowedActions = getAllowedActions(loan.state);
  if (!allowedActions.includes(action)) {
    return res.status(409).json(error(
      'LOAN_STATE_INVALID',
      `Action ${action} not allowed in state ${loan.state}`,
      { currentState: loan.state, allowedActions }
    ));
  }

  // Check preconditions
  const preconditions = getPreconditions(loan.state, action);
  for (const check of preconditions) {
    if (!check(loan)) {
      return res.status(409).json(error('PRECONDITION_FAILED', check.message));
    }
  }

  // Perform transition
  const newState = getNewState(loan.state, action);
  loan.state = newState;
  loan.stateHistory.push({
    state: newState,
    changedAt: new Date(),
    changedBy: req.user.id,
    reason: metadata.reason
  });

  await loan.save();

  // Create audit entry
  await AuditLog.create({
    userId: req.user.id,
    entityType: 'LOAN',
    entityId: loan._id,
    action: action,
    before: { state: loan.state },
    after: { state: newState },
    timestamp: new Date()
  });

  res.json(success({
    state: newState,
    allowedActions: getAllowedActions(newState)
  }));
};

module.exports = { transitionLoan };
```

### 2.2 Payments Domain

**File:** `backend/src/domains/payments/payment.controller.js`

```javascript
const recordPayment = async (req, res) => {
  const { loanId, amount, method, reference } = req.body;

  // Get loan
  const loan = await Loan.findById(loanId);
  if (!loan) return res.status(404).json(error('LOAN_NOT_FOUND', 'Loan not found'));

  // Find oldest unpaid installment
  const installment = await Installment.findOne({
    loanId,
    status: { $in: ['pending', 'partially_paid'] }
  }).sort({ sequence: 1 });

  if (!installment) {
    return res.status(409).json(error('NO_PENDING_INSTALLMENT', 'No pending installment'));
  }

  // Create payment
  const payment = await Payment.create({
    loanId,
    amount,
    method,
    reference,
    status: 'confirmed',
    createdBy: req.user.id
  });

  // Update installment
  installment.paidPrincipal += amount;
  if (installment.paidPrincipal >= installment.principalDue) {
    installment.status = 'paid';
  } else {
    installment.status = 'partially_paid';
  }
  await installment.save();

  // Update loan outstanding
  loan.outstandingAmount -= amount;
  await loan.save();

  // Create audit entry
  await AuditLog.create({
    userId: req.user.id,
    entityType: 'PAYMENT',
    entityId: payment._id,
    action: 'CREATE',
    after: payment.toObject(),
    timestamp: new Date()
  });

  res.json(success(payment));
};

module.exports = { recordPayment };
```

---

## Phase 3: Automation

### 3.1 DPD Engine

**File:** `backend/src/jobs/dpdEngine.js`

```javascript
const dpdEngine = async () => {
  console.log('[DPD Engine] Starting...');

  // Get all installments
  const installments = await Installment.find();

  for (const inst of installments) {
    const today = new Date();
    const dueDate = new Date(inst.dueDate);

    if (dueDate < today && inst.status !== 'paid') {
      const dpd = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      inst.dpd = dpd;
      inst.status = 'overdue';
      await inst.save();
    }
  }

  // Update loan DPD
  const loans = await Loan.find();
  for (const loan of loans) {
    const installments = await Installment.find({ loanId: loan._id });
    const maxDPD = Math.max(...installments.map(i => i.dpd || 0), 0);
    loan.dpd = maxDPD;
    await loan.save();
  }

  console.log('[DPD Engine] Completed');
};

// Schedule: 2:30 AM daily
cron.schedule('30 2 * * *', dpdEngine);
```

### 3.2 State Escalation

**File:** `backend/src/jobs/stateEscalation.js`

```javascript
const stateEscalation = async () => {
  console.log('[State Escalation] Starting...');

  const LEGAL_THRESHOLD = 90; // days

  const loans = await Loan.find({ state: 'ACTIVE' });

  for (const loan of loans) {
    // Escalate to DELINQUENT
    if (loan.dpd > 0 && loan.state === 'ACTIVE') {
      loan.state = 'DELINQUENT';
      await loan.save();
    }

    // Escalate to LEGAL
    if (loan.dpd >= LEGAL_THRESHOLD && loan.state !== 'LEGAL') {
      loan.state = 'LEGAL';
      await LegalCase.create({
        loanId: loan._id,
        dpdAtEntry: loan.dpd,
        status: 'OPEN'
      });
      await loan.save();
    }
  }

  console.log('[State Escalation] Completed');
};

// Schedule: 3:00 AM daily
cron.schedule('0 3 * * *', stateEscalation);
```

---

## Phase 4: MIS Reports

**File:** `backend/src/domains/mis/mis.controller.js`

```javascript
const getPortfolio = async (req, res) => {
  const loans = await Loan.find({ state: { $in: ['ACTIVE', 'DELINQUENT', 'LEGAL'] } });

  const portfolio = {
    totalLoans: loans.length,
    totalPrincipal: loans.reduce((sum, l) => sum + l.principal, 0),
    totalOutstanding: loans.reduce((sum, l) => sum + l.outstandingAmount, 0),
    totalInterest: loans.reduce((sum, l) => sum + (l.totalAmount - l.principal), 0)
  };

  res.json(success(portfolio));
};

const getBuckets = async (req, res) => {
  const loans = await Loan.find({ state: { $in: ['ACTIVE', 'DELINQUENT', 'LEGAL'] } });

  const buckets = {};
  const bucketNames = ['CURRENT', 'X', 'Y', 'M1', 'M2', 'M3', 'NPA'];

  for (const bucket of bucketNames) {
    const loansInBucket = loans.filter(l => l.bucket === bucket);
    buckets[bucket] = {
      count: loansInBucket.length,
      amount: loansInBucket.reduce((sum, l) => sum + l.outstandingAmount, 0),
      avgDPD: loansInBucket.length > 0
        ? loansInBucket.reduce((sum, l) => sum + l.dpd, 0) / loansInBucket.length
        : 0
    };
  }

  res.json(success(buckets));
};

module.exports = { getPortfolio, getBuckets };
```

---

## Phase 5: Testing

### 5.1 Test Workflow

```bash
# 1. Create lead
POST /api/v1/leads
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com"
}

# 2. Convert to application
POST /api/v1/leads/:id/convert

# 3. Create loan
POST /api/v1/loans
{
  "customerId": "customer-123",
  "principal": 100000,
  "annualInterestRate": 12,
  "termMonths": 12
}

# 4. Evaluate credit
POST /api/v1/credit/evaluate
{
  "loanId": "loan-123"
}

# 5. Approve loan
POST /api/v1/loans/:id/transition
{
  "action": "APPROVE"
}

# 6. Disburse loan
POST /api/v1/disbursements/:id/disburse

# 7. Record payment
POST /api/v1/payments
{
  "loanId": "loan-123",
  "amount": 10000,
  "method": "TRANSFER"
}

# 8. View MIS
GET /api/v1/reports/portfolio
GET /api/v1/reports/buckets
```

---

## 🚀 Deployment Checklist

- [ ] All middleware registered in correct order
- [ ] Response envelope implemented
- [ ] Error handler implemented
- [ ] All domains implemented
- [ ] All routes registered
- [ ] All cron jobs scheduled
- [ ] Audit logging enabled
- [ ] Database indexes created
- [ ] Environment variables set
- [ ] Tests passing
- [ ] Documentation updated

---

**This guide implements the Technical Operating Specification.**

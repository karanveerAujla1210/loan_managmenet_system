# MIS Reports System - Implementation Fixes

## Fix #1: Register Reports Routes in app.js

**File:** `backend/src/app.js`

**Current Code:**
```javascript
try {
  app.use('/api/v1/auth', require('../routes/auth'));
} catch (e) {
  console.error('Auth route error:', e.message);
}

try {
  app.use('/api/v1/loans', require('../routes/loans'));
} catch (e) {
  console.error('Loans route error:', e.message);
}

// ... more routes but NO reports routes
```

**Fix:**
```javascript
try {
  app.use('/api/v1/reports', require('./routes/reports.routes'));
} catch (e) {
  console.error('Reports route error:', e.message);
}
```

**Location:** Add after line 50 (after dashboard routes)

---

## Fix #2: Register Reports Routes in app-production.js

**File:** `backend/src/app-production.js`

**Current Code:**
```javascript
const misRoutes = require('./routes/mis.routes');
// ... other routes

app.use('/api/v1/mis', misRoutes);
// ... other route registrations
```

**Fix:**
```javascript
const misRoutes = require('./routes/mis.routes');
const reportsRoutes = require('./routes/reports.routes');
// ... other routes

app.use('/api/v1/mis', misRoutes);
app.use('/api/v1/reports', auth, authorize('admin', 'manager'), reportsRoutes);
// ... other route registrations
```

**Location:** Add after line 35 (after importing routes)

---

## Fix #3: Fix Schema Field Names in reports.routes.js

**File:** `backend/src/routes/reports.routes.js`

**Current Code (Wrong):**
```javascript
const result = await Loan.aggregate([
  { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },
  {
    $group: {
      _id: null,
      totalLoans: { $sum: 1 },
      totalPrincipal: { $sum: '$loanAmount' },  // ❌ Wrong field
      totalOutstanding: { $sum: '$outstandingAmount' }  // ❌ Virtual field
    }
  }
]);
```

**Fix:**
```javascript
const result = await Loan.aggregate([
  { $match: { status: { $in: ['active', 'closed', 'npa'] } } },
  {
    $group: {
      _id: null,
      totalLoans: { $sum: 1 },
      totalPrincipal: { $sum: '$principal' },  // ✅ Correct field
      totalOutstanding: {
        $sum: {
          $sum: {
            $map: {
              input: '$schedule',
              as: 'inst',
              in: {
                $subtract: [
                  { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                  { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                ]
              }
            }
          }
        }
      }
    }
  }
]);
```

---

## Fix #4: Fix Bucket Exposure Logic

**File:** `backend/src/routes/reports.routes.js`

**Current Code (Wrong):**
```javascript
router.get('/buckets', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Loan.aggregate([
      { $match: { status: { $in: ['ACTIVE', 'CLOSED'] } } },
      {
        $group: {
          _id: '$status',  // ❌ Groups by status, not bucket
          loanCount: { $sum: 1 },
          outstandingAmount: { $sum: '$outstandingAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**Fix:**
```javascript
router.get('/buckets', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Loan.aggregate([
      { $match: { status: { $in: ['active', 'npa'] } } },
      {
        $addFields: {
          bucket: {
            $cond: [
              { $lte: ['$dpd', 0] }, 'current',
              { $cond: [
                { $lte: ['$dpd', 7] }, 'X',
                { $cond: [
                  { $lte: ['$dpd', 30] }, 'Y',
                  { $cond: [
                    { $lte: ['$dpd', 60] }, 'M1',
                    { $cond: [
                      { $lte: ['$dpd', 90] }, 'M2',
                      { $cond: [
                        { $lte: ['$dpd', 180] }, 'M3', 'NPA'
                      ]}
                    ]}
                  ]}
                ]}
              ]}
            ]
          }
        }
      },
      {
        $group: {
          _id: '$bucket',
          loanCount: { $sum: 1 },
          outstandingAmount: {
            $sum: {
              $sum: {
                $map: {
                  input: '$schedule',
                  as: 'inst',
                  in: {
                    $subtract: [
                      { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                      { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                    ]
                  }
                }
              }
            }
          },
          avgDPD: { $avg: '$dpd' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

---

## Fix #5: Fix Aging Analysis Logic

**File:** `backend/src/routes/reports.routes.js`

**Current Code (Wrong):**
```javascript
router.get('/aging', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Installment.aggregate([
      {
        $group: {
          _id: '$status',  // ❌ Groups by status, not age
          loanCount: { $sum: 1 },
          totalAmount: { $sum: '$emiAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const aging = result.map(r => ({
      period: r._id,
      loanCount: r.loanCount,
      outstandingAmount: r.totalAmount
    }));

    res.json({
      success: true,
      data: aging,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**Fix:**
```javascript
router.get('/aging', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Loan.aggregate([
      { $match: { status: { $in: ['active', 'npa'] } } },
      {
        $addFields: {
          ageInDays: {
            $divide: [
              { $subtract: [today, '$disbursementDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $addFields: {
          agePeriod: {
            $cond: [
              { $lte: ['$ageInDays', 30] }, '0-30 days',
              { $cond: [
                { $lte: ['$ageInDays', 60] }, '31-60 days',
                { $cond: [
                  { $lte: ['$ageInDays', 90] }, '61-90 days', '90+ days'
                ]}
              ]}
            ]
          }
        }
      },
      {
        $group: {
          _id: '$agePeriod',
          loanCount: { $sum: 1 },
          outstandingAmount: {
            $sum: {
              $sum: {
                $map: {
                  input: '$schedule',
                  as: 'inst',
                  in: {
                    $subtract: [
                      { $add: ['$$inst.principalDue', '$$inst.interestDue', '$$inst.penaltyDue'] },
                      { $add: ['$$inst.paidPrincipal', '$$inst.paidInterest', '$$inst.paidPenalty'] }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);

    const agingMap = {
      '0-30 days': 0,
      '31-60 days': 0,
      '61-90 days': 0,
      '90+ days': 0
    };

    result.forEach(r => {
      agingMap[r._id] = { loanCount: r.loanCount, outstandingAmount: r.outstandingAmount };
    });

    const aging = Object.entries(agingMap).map(([period, data]) => ({
      period,
      loanCount: data.loanCount || 0,
      outstandingAmount: data.outstandingAmount || 0
    }));

    res.json({
      success: true,
      data: aging,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

---

## Fix #6: Fix Collection Efficiency Logic

**File:** `backend/src/routes/reports.routes.js`

**Current Code (Wrong):**
```javascript
router.get('/efficiency', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const result = await Installment.aggregate([
      {
        $group: {
          _id: null,
          dueAmount: { $sum: '$emiAmount' },  // ❌ Wrong field
          collectedAmount: { $sum: '$paidAmount' }  // ❌ Wrong field
        }
      },
      {
        $project: {
          dueAmount: 1,
          collectedAmount: 1,
          efficiency: {
            $cond: [
              { $eq: ['$dueAmount', 0] },
              0,
              { $multiply: [{ $divide: ['$collectedAmount', '$dueAmount'] }, 100] }
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: result[0] || { dueAmount: 0, collectedAmount: 0, efficiency: 0 },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**Fix:**
```javascript
router.get('/efficiency', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Loan.aggregate([
      { $match: { status: { $in: ['active', 'npa'] } } },
      {
        $unwind: '$schedule'
      },
      {
        $match: {
          'schedule.dueDate': { $lte: today }
        }
      },
      {
        $group: {
          _id: null,
          dueAmount: {
            $sum: {
              $add: [
                '$schedule.principalDue',
                '$schedule.interestDue',
                '$schedule.penaltyDue'
              ]
            }
          },
          collectedAmount: {
            $sum: {
              $add: [
                '$schedule.paidPrincipal',
                '$schedule.paidInterest',
                '$schedule.paidPenalty'
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          dueAmount: 1,
          collectedAmount: 1,
          efficiency: {
            $cond: [
              { $eq: ['$dueAmount', 0] },
              0,
              { $multiply: [{ $divide: ['$collectedAmount', '$dueAmount'] }, 100] }
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: result[0] || { dueAmount: 0, collectedAmount: 0, efficiency: 0 },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

---

## Fix #7: Create Standalone Installment Model

**File:** `backend/src/models/installment.model.js` (NEW FILE)

```javascript
const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true,
    index: true
  },
  sequence: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },
  principalDue: {
    type: Number,
    required: true
  },
  interestDue: {
    type: Number,
    required: true
  },
  penaltyDue: {
    type: Number,
    default: 0
  },
  paidPrincipal: {
    type: Number,
    default: 0
  },
  paidInterest: {
    type: Number,
    default: 0
  },
  paidPenalty: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid', 'overdue'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
InstallmentSchema.index({ loanId: 1, sequence: 1 });
InstallmentSchema.index({ dueDate: 1 });
InstallmentSchema.index({ status: 1 });

module.exports = mongoose.model('Installment', InstallmentSchema);
```

---

## Fix #8: Update models/index.js

**File:** `backend/src/models/index.js`

**Current Code:**
```javascript
const User = require('./user.model');
const Loan = require('./loan.model');
const Installment = require('./installment.model');
const Payment = require('./payment.model');
const Customer = require('./customer.model');
const AuditLog = require('./audit-log.model');
const Dispute = require('./dispute.model');
const CollectorPerformance = require('./collector-performance.model');
const BankReconciliation = require('./bank-reconciliation.model');
const LoanBucketHistory = require('./loan-bucket-history.model');
const PromiseToPay = require('./promise-to-pay.model');

module.exports = {
  User,
  Loan,
  Installment,
  Payment,
  Customer,
  AuditLog,
  Dispute,
  CollectorPerformance,
  BankReconciliation,
  LoanBucketHistory,
  PromiseToPay
};
```

**Fix (Add missing models):**
```javascript
const User = require('./user.model');
const Loan = require('./loan.model');
const Installment = require('./installment.model');
const Payment = require('./payment.model');
const Customer = require('./customer.model');
const AuditLog = require('./audit-log.model');
const Dispute = require('./dispute.model');
const CollectorPerformance = require('./collector-performance.model');
const BankReconciliation = require('./bank-reconciliation.model');
const LoanBucketHistory = require('./loan-bucket-history.model');
const PromiseToPay = require('./promise-to-pay.model');
const LegalCase = require('./legal-case.model');
const Document = require('./document.model');
const Branch = require('./branch.model');
const CronRun = require('./cron-run.model');

module.exports = {
  User,
  Loan,
  Installment,
  Payment,
  Customer,
  AuditLog,
  Dispute,
  CollectorPerformance,
  BankReconciliation,
  LoanBucketHistory,
  PromiseToPay,
  LegalCase,
  Document,
  Branch,
  CronRun
};
```

---

## Fix #9: Add Error Handling to Reports Routes

**File:** `backend/src/routes/reports.routes.js`

**Add at top:**
```javascript
const express = require('express');
const Loan = require('../models/loan.model');
const Payment = require('../models/payment.model');
const LegalCase = require('../models/legal-case.model');
const CollectorPerformance = require('../models/collector-performance.model');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Wrap all routes:**
```javascript
router.get('/portfolio', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  // ... route logic
}));
```

---

## Fix #10: Add Validation to Reports Routes

**File:** `backend/src/routes/reports.routes.js`

**Add query parameter validation:**
```javascript
router.get('/efficiency', protect, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter = {};
  if (startDate) {
    dateFilter.$gte = new Date(startDate);
  }
  if (endDate) {
    dateFilter.$lte = new Date(endDate);
  }

  const result = await Loan.aggregate([
    {
      $match: {
        status: { $in: ['active', 'npa'] },
        ...(Object.keys(dateFilter).length > 0 && { disbursementDate: dateFilter })
      }
    },
    // ... rest of aggregation
  ]);

  res.json({
    success: true,
    data: result[0] || { dueAmount: 0, collectedAmount: 0, efficiency: 0 },
    meta: { timestamp: new Date().toISOString() }
  });
}));
```

---

## Testing Checklist

- [ ] Routes registered in app.js
- [ ] Routes registered in app-production.js
- [ ] Portfolio endpoint returns correct data
- [ ] Buckets endpoint groups by DPD correctly
- [ ] Aging endpoint groups by disbursement date correctly
- [ ] Efficiency endpoint calculates correctly
- [ ] Legal endpoint returns case data
- [ ] Collectors endpoint returns performance data
- [ ] All endpoints require authentication
- [ ] All endpoints require admin/manager role
- [ ] Error handling works for invalid requests
- [ ] Frontend receives data and displays correctly


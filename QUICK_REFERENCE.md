# MIS Reports System - Quick Reference Guide

## 🎯 What's Missing (TL;DR)

| Issue | Location | Fix | Priority |
|-------|----------|-----|----------|
| Routes not registered | `app.js`, `app-production.js` | Add route imports | 🔴 CRITICAL |
| Wrong schema fields | `reports.routes.js` | Change `loanAmount` → `principal` | 🔴 CRITICAL |
| Bucket logic wrong | `reports.routes.js` | Use DPD instead of status | 🟠 HIGH |
| Aging logic wrong | `reports.routes.js` | Use disbursement date instead of status | 🟠 HIGH |
| Missing model exports | `models/index.js` | Export LegalCase, CollectorPerformance | 🟠 HIGH |
| Installment not standalone | `models/installment.model.js` | Create new file | 🟠 HIGH |

---

## 📊 Data Flow Summary

```
Frontend Request
    ↓
/api/v1/reports/portfolio
    ↓
❌ Route not found (404)
    ↓
Frontend shows empty data
```

**After Fix:**
```
Frontend Request
    ↓
/api/v1/reports/portfolio
    ↓
✅ Route found
    ↓
Middleware: Auth + Authorization
    ↓
Service: Query MongoDB
    ↓
Return: Portfolio metrics
    ↓
Frontend displays data
```

---

## 🔧 One-Line Fixes

### 1. Register Routes in app.js
```javascript
app.use('/api/v1/reports', require('./routes/reports.routes'));
```

### 2. Register Routes in app-production.js
```javascript
app.use('/api/v1/reports', auth, authorize('admin', 'manager'), reportsRoutes);
```

### 3. Fix Portfolio Query
```javascript
// Change from:
$sum: '$loanAmount'
// To:
$sum: '$principal'
```

### 4. Fix Bucket Grouping
```javascript
// Change from:
$group: { _id: '$status', ... }
// To:
$addFields: { bucket: { $cond: [{ $lte: ['$dpd', 0] }, 'current', ...] } }
$group: { _id: '$bucket', ... }
```

### 5. Fix Aging Grouping
```javascript
// Change from:
$group: { _id: '$status', ... }
// To:
$addFields: { agePeriod: { $cond: [{ $lte: ['$ageInDays', 30] }, '0-30 days', ...] } }
$group: { _id: '$agePeriod', ... }
```

---

## 📋 API Endpoints

### Portfolio Snapshot
```
GET /api/v1/reports/portfolio
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": {
    "totalLoans": 1250,
    "totalPrincipal": 50000000,
    "totalOutstanding": 12500000,
    "totalInterest": 2500000
  }
}
```

### Bucket Exposure
```
GET /api/v1/reports/buckets
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": [
    { "_id": "current", "loanCount": 800, "outstandingAmount": 5000000 },
    { "_id": "X", "loanCount": 150, "outstandingAmount": 2000000 },
    ...
  ]
}
```

### Collection Efficiency
```
GET /api/v1/reports/efficiency
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": {
    "dueAmount": 5000000,
    "collectedAmount": 4500000,
    "efficiency": 90.0
  }
}
```

### Legal Exposure
```
GET /api/v1/reports/legal
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": {
    "totalCases": 45,
    "breakdown": [
      { "_id": "filed", "count": 20 },
      { "_id": "in_progress", "count": 15 },
      { "_id": "resolved", "count": 10 }
    ]
  }
}
```

### Collector Performance
```
GET /api/v1/reports/collectors
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": { "name": "John Doe", "email": "john@example.com" },
      "weekStartDate": "2024-01-08T00:00:00Z",
      "totalScore": 85.5,
      "incentivePercentage": 12.5
    }
  ]
}
```

### Aging Analysis
```
GET /api/v1/reports/aging
Authorization: Bearer <token>
Role: admin, manager

Response:
{
  "success": true,
  "data": [
    { "period": "0-30 days", "loanCount": 600, "outstandingAmount": 3000000 },
    { "period": "31-60 days", "loanCount": 300, "outstandingAmount": 2000000 },
    { "period": "61-90 days", "loanCount": 200, "outstandingAmount": 1500000 },
    { "period": "90+ days", "loanCount": 150, "outstandingAmount": 1000000 }
  ]
}
```

---

## 🗂️ File Structure

```
backend/src/
├── routes/
│   ├── reports.routes.js          ← Main reports endpoints
│   └── mis.routes.js              ← MIS-specific endpoints
├── services/
│   ├── reports.service.js         ← Business logic
│   └── mis-report.service.js      ← MIS logic
├── controllers/
│   └── reports.controller.js      ← Request handlers
├── models/
│   ├── loan.model.js              ← Loan schema
│   ├── installment.model.js       ← Installment schema (NEW)
│   ├── payment.model.js           ← Payment schema
│   ├── customer.model.js          ← Customer schema
│   ├── legal-case.model.js        ← Legal case schema
│   ├── collector-performance.model.js
│   └── index.js                   ← Model exports
├── middlewares/
│   ├── auth.middleware.js         ← JWT verification
│   └── ...
├── app.js                         ← Main app (needs fix)
└── app-production.js              ← Production app (needs fix)

frontend-unified/src/
├── pages/
│   └── MISReports/
│       └── index.jsx              ← Frontend UI
├── services/
│   └── api.js                     ← API calls
└── ...
```

---

## 🔍 Schema Reference

### Loan Model
```javascript
{
  loanId: String,
  customerId: ObjectId,
  principal: Number,              // ← Use this, not loanAmount
  annualInterestRate: Number,
  termMonths: Number,
  emiAmount: Number,
  disbursementDate: Date,         // ← Use for aging
  status: String,                 // active, closed, npa
  dpd: Number,                    // ← Use for buckets (Days Past Due)
  bucket: String,                 // current, X, Y, M1, M2, M3, NPA
  schedule: [InstallmentSchema],  // ← Embedded installments
  createdAt: Date,
  updatedAt: Date
}
```

### Installment Schema (Embedded in Loan)
```javascript
{
  sequence: Number,
  dueDate: Date,
  principalDue: Number,
  interestDue: Number,
  penaltyDue: Number,
  paidPrincipal: Number,
  paidInterest: Number,
  paidPenalty: Number,
  status: String                  // pending, partially_paid, paid, overdue
}
```

### Payment Model
```javascript
{
  paymentId: String,
  loanId: ObjectId,
  customerId: ObjectId,
  amount: Number,
  method: String,                 // razorpay, stripe, bank_transfer, etc
  status: String,                 // initiated, pending, success, failed
  allocation: {
    principal: Number,
    interest: Number,
    penalty: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧮 Calculation Formulas

### Outstanding Amount
```
Outstanding = Sum of all installments:
  (principalDue + interestDue + penaltyDue) - (paidPrincipal + paidInterest + paidPenalty)
```

### Bucket Assignment (Based on DPD)
```
if dpd <= 0      → CURRENT
if dpd <= 7      → X
if dpd <= 30     → Y
if dpd <= 60     → M1
if dpd <= 90     → M2
if dpd <= 180    → M3
if dpd > 180     → NPA
```

### Aging Period (Based on Disbursement Date)
```
ageInDays = (Today - disbursementDate) / (24 * 60 * 60 * 1000)

if ageInDays <= 30   → 0-30 days
if ageInDays <= 60   → 31-60 days
if ageInDays <= 90   → 61-90 days
if ageInDays > 90    → 90+ days
```

### Collection Efficiency
```
Efficiency = (Collected Amount / Due Amount) × 100

Where:
  Due Amount = Sum of all due installments (principal + interest + penalty)
  Collected Amount = Sum of all paid amounts (paid principal + paid interest + paid penalty)
```

---

## 🚀 Implementation Steps

### Step 1: Register Routes (5 minutes)
1. Open `backend/src/app.js`
2. Add: `app.use('/api/v1/reports', require('./routes/reports.routes'));`
3. Open `backend/src/app-production.js`
4. Add: `app.use('/api/v1/reports', auth, authorize('admin', 'manager'), reportsRoutes);`

### Step 2: Fix Schema Fields (10 minutes)
1. Open `backend/src/routes/reports.routes.js`
2. Change `$sum: '$loanAmount'` → `$sum: '$principal'`
3. Fix outstanding amount calculation using schedule array

### Step 3: Fix Bucket Logic (15 minutes)
1. Add `$addFields` stage to calculate bucket from DPD
2. Change `$group` to group by bucket instead of status

### Step 4: Fix Aging Logic (15 minutes)
1. Add `$addFields` stage to calculate age in days
2. Add another `$addFields` to assign period
3. Change `$group` to group by period

### Step 5: Create Installment Model (5 minutes)
1. Create `backend/src/models/installment.model.js`
2. Copy schema from loan model
3. Add indexes

### Step 6: Update Model Exports (5 minutes)
1. Open `backend/src/models/index.js`
2. Add missing model exports

### Step 7: Test (10 minutes)
1. Start backend: `npm run dev`
2. Test endpoints with Postman/curl
3. Check frontend displays data

**Total Time: ~60 minutes**

---

## 🐛 Common Issues & Solutions

### Issue: 404 Not Found
**Cause:** Routes not registered in app.js
**Solution:** Add route registration in app.js and app-production.js

### Issue: Empty Data in Frontend
**Cause:** API returns 404 or empty response
**Solution:** Check route registration and database data

### Issue: Wrong Bucket Distribution
**Cause:** Grouping by status instead of DPD
**Solution:** Use DPD-based bucket assignment logic

### Issue: Aging Shows Wrong Periods
**Cause:** Grouping by installment status instead of loan age
**Solution:** Calculate age from disbursement date

### Issue: Outstanding Amount is 0
**Cause:** Using non-existent field or wrong calculation
**Solution:** Calculate from schedule array using map/reduce

### Issue: Authorization Denied
**Cause:** User role is not admin/manager
**Solution:** Check user role in database or use different role

---

## 📞 Support

For detailed implementation, see:
- `PROJECT_REVIEW_SUMMARY.md` - Complete analysis
- `FLOW_DIAGRAMS.md` - Visual flows
- `IMPLEMENTATION_FIXES.md` - Step-by-step fixes


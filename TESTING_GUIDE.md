# TESTING GUIDE - Technical Operating Spec Implementation

## 🧪 POSTMAN COLLECTION

### 1. Test Loan State Transition

**Request:**
```
POST http://localhost:5000/api/v1/loans/:id/transition
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "APPROVE",
  "metadata": {
    "reason": "Good credit profile"
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "state": "APPROVED",
    "allowedActions": ["DISBURSED", "REJECTED"]
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": {
    "code": "LOAN_STATE_INVALID",
    "message": "Invalid loan state transition",
    "details": {
      "currentState": "LEAD"
    }
  }
}
```

---

### 2. Test Idempotent Payment

**Request 1:**
```
POST http://localhost:5000/api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId": "loan-123",
  "amount": 5000,
  "method": "TRANSFER",
  "reference": "UTR-12345",
  "idempotencyKey": "payment-key-001"
}
```

**Response 1 (200):**
```json
{
  "success": true,
  "data": {
    "_id": "payment-123",
    "loanId": "loan-123",
    "amount": 5000,
    "status": "confirmed"
  }
}
```

**Request 2 (Same idempotencyKey):**
```
POST http://localhost:5000/api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId": "loan-123",
  "amount": 5000,
  "method": "TRANSFER",
  "reference": "UTR-12345",
  "idempotencyKey": "payment-key-001"
}
```

**Response 2 (Same as Response 1 - No duplicate):**
```json
{
  "success": true,
  "data": {
    "_id": "payment-123",
    "loanId": "loan-123",
    "amount": 5000,
    "status": "confirmed"
  }
}
```

---

### 3. Test Collections Dashboard

**Request:**
```
GET http://localhost:5000/api/v1/collections/dashboard
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLoans": 1250,
    "totalOutstanding": 12500000,
    "atRisk": 450,
    "riskPercentage": "36.00",
    "buckets": {
      "CURRENT": { "count": 800, "amount": 5000000 },
      "X": { "count": 150, "amount": 2000000 },
      "Y": { "count": 100, "amount": 1500000 },
      "M1": { "count": 80, "amount": 1200000 },
      "M2": { "count": 60, "amount": 900000 },
      "M3": { "count": 40, "amount": 600000 },
      "NPA": { "count": 20, "amount": 300000 }
    }
  }
}
```

---

### 4. Test Allowed Actions

**Request:**
```
GET http://localhost:5000/api/v1/loans/:id/allowed-actions
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "state": "APPROVED",
    "allowedActions": ["DISBURSED", "REJECTED"]
  }
}
```

---

## 🔍 VERIFICATION TESTS

### Test 1: State Transition Validation
```bash
# Should succeed
POST /api/v1/loans/:id/transition
{ "action": "APPROVE" }
# Response: 200 OK

# Should fail (invalid transition)
POST /api/v1/loans/:id/transition
{ "action": "CLOSE" }
# Response: 409 Conflict
```

### Test 2: Idempotent Payments
```bash
# First payment
POST /api/v1/payments
{ "loanId": "loan-123", "amount": 5000, "idempotencyKey": "key-1" }
# Response: 200 OK, payment created

# Same payment again
POST /api/v1/payments
{ "loanId": "loan-123", "amount": 5000, "idempotencyKey": "key-1" }
# Response: 200 OK, same payment returned (no duplicate)
```

### Test 3: Audit Logging
```bash
# Check audit logs
GET /api/v1/audit-log?entityType=LOAN&action=APPROVE
# Should show all loan approvals with user, timestamp, before/after
```

### Test 4: Cron Jobs
```bash
# Check server logs at 2:30 AM
# Should see: "[DPD Engine] Starting..."
# Should see: "[DPD Engine] Completed"

# Check server logs at 3:00 AM
# Should see: "[State Escalation] Starting..."
# Should see: "[State Escalation] Completed"
```

---

## 📊 DATABASE VERIFICATION

### Check Loan State History
```javascript
db.loans.findOne({ _id: ObjectId("...") })
// Should have stateHistory array with all transitions
```

### Check Audit Logs
```javascript
db.auditlogs.find({ entityType: "LOAN" })
// Should have entry for each state transition
```

### Check Payments
```javascript
db.payments.find({ loanId: ObjectId("...") })
// Should have all payments with idempotencyKey
```

### Check Installments
```javascript
db.installments.find({ loanId: ObjectId("...") })
// Should have updated dpd and status
```

---

## 🚨 ERROR SCENARIOS

### Scenario 1: Invalid State Transition
```
Current State: LEAD
Action: CLOSE
Expected: 409 Conflict
Error Code: LOAN_STATE_INVALID
```

### Scenario 2: Loan Not Found
```
Loan ID: invalid-id
Expected: 404 Not Found
Error Code: LOAN_NOT_FOUND
```

### Scenario 3: Invalid Payment Amount
```
Amount: -5000
Expected: 400 Bad Request
Error Code: INVALID_AMOUNT
```

### Scenario 4: No Pending Installment
```
Loan: All installments paid
Action: Record payment
Expected: 409 Conflict
Error Code: NO_PENDING_INSTALLMENT
```

---

## ✅ FINAL CHECKLIST

- [ ] Backend starts without errors
- [ ] All routes respond with correct status codes
- [ ] State transitions validated
- [ ] Payments are idempotent
- [ ] Audit logs created
- [ ] Collections dashboard returns data
- [ ] Cron jobs scheduled
- [ ] Error handling consistent
- [ ] RBAC enforced
- [ ] Database updated correctly

---

**Testing Date:** 2024-01-15
**Status:** Ready for Testing ✅

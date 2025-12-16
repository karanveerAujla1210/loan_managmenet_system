# Safe Import Flow Documentation

## Overview
This document describes the 5-step import process that prevents data corruption and ensures consistency.

---

## Step 1️⃣: Frontend Upload (CSV Only)

**What frontend sends:**
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,BL-100,50000,2024-01-15,Collector1
Jane Smith,9876543211,BL-100,75000,2024-01-16,Collector2
```

**Frontend rules:**
- CSV/Excel only (no JSON)
- No manual calculations
- No status fields
- No instalment data

---

## Step 2️⃣: Backend Validation (No DB Writes)

**Endpoint:** `POST /api/import/loans/validate`

**Request:**
```json
{
  "rows": [
    {
      "borrower_name": "John Doe",
      "phone": "9876543210",
      "product_code": "BL-100",
      "loan_amount": 50000,
      "disbursement_date": "2024-01-15",
      "assigned_collector": "Collector1"
    }
  ]
}
```

**Validation checks:**
- ✅ All required fields present
- ✅ Product exists and is active
- ✅ Collector exists and is active
- ✅ Loan amount > 0
- ✅ Disbursement date not in future
- ✅ No duplicate loans (phone + date within 7 days)

**Response (Success):**
```json
{
  "success": true,
  "message": "All rows valid",
  "validRowCount": 2,
  "normalized": [
    {
      "borrowerName": "John Doe",
      "phone": "9876543210",
      "productId": "507f1f77bcf86cd799439011",
      "loanAmount": 50000,
      "totalPayable": 60000,
      "weeklyEmi": 4285.71,
      "disbursementDate": "2024-01-15T00:00:00.000Z",
      "assignedTo": "507f1f77bcf86cd799439012",
      "product": { ... },
      "collector": { ... }
    }
  ]
}
```

**Response (Errors):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "row": 2,
      "errors": ["product_code 'INVALID' not found"]
    }
  ],
  "validRowCount": 1,
  "totalRows": 2
}
```

---

## Step 3️⃣: Preview Mode (Show Calculated Data)

**Endpoint:** `POST /api/import/loans/preview`

**Request:**
```json
{
  "normalized": [ ... ]  // From Step 2 response
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preview generated",
  "loanCount": 2,
  "preview": [
    {
      "borrowerName": "John Doe",
      "phone": "9876543210",
      "loanAmount": 50000,
      "totalPayable": 60000,
      "weeklyEmi": 4285.71,
      "disbursementDate": "2024-01-15",
      "collectorName": "Collector1",
      "productCode": "BL-100",
      "firstThreeInstalments": [
        {
          "instalmentNo": 1,
          "dueDate": "2024-01-22",
          "dueAmount": 4285.71
        },
        {
          "instalmentNo": 2,
          "dueDate": "2024-01-29",
          "dueAmount": 4285.71
        },
        {
          "instalmentNo": 3,
          "dueDate": "2024-02-05",
          "dueAmount": 4285.71
        }
      ]
    }
  ]
}
```

**Frontend shows:**
- "This is how the system will understand your data"
- Calculated interest, EMI, due dates
- "Confirm Import" button (only after preview)

---

## Step 4️⃣: Atomic Commit (Transaction)

**Endpoint:** `POST /api/import/loans/confirm`

**Request:**
```json
{
  "normalized": [ ... ]  // From Step 2 response
}
```

**Backend does (in transaction):**
1. Create Loan documents
2. Generate all Instalment documents
3. Lock loan as ACTIVE
4. Commit transaction

**If any step fails:**
- Entire transaction rolls back
- No partial data in database
- Error returned to frontend

**Response (Success):**
```json
{
  "success": true,
  "message": "2 loans imported successfully",
  "batchId": "BATCH-1705334400000",
  "loanCount": 2
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Import failed: Duplicate loan detected"
}
```

---

## Step 5️⃣: Payments Import (Separate Flow)

**Payments CSV:**
```csv
loan_identifier,instalment_no,amount,payment_date,mode,reference
9876543210,1,4285.71,2024-01-22,UPI,UPI123456
9876543210,2,4285.71,2024-01-29,IMPS,IMPS789012
```

**Endpoint:** `POST /api/import/payments/validate`

**Validation:**
- ✅ Loan exists
- ✅ Instalment exists for that loan
- ✅ Amount > 0
- ✅ Payment date valid

**Endpoint:** `POST /api/import/payments/confirm`

**Backend does (in transaction):**
1. Create Payment document
2. Update Instalment:
   - Add to paidAmount
   - Update status (DUE → PARTIAL → PAID)
   - Set paidOn date
3. Update Loan outstandingAmount
4. Commit transaction

---

## Status Calculation (Never Imported)

### Instalment Status
```javascript
if (paidAmount >= dueAmount) {
  status = 'PAID'
} else if (paidAmount > 0) {
  status = 'PARTIAL'
} else if (today > dueDate) {
  status = 'OVERDUE'
} else {
  status = 'DUE'
}
```

### Loan Status
```javascript
if (all instalments are PAID) {
  status = 'CLOSED'
} else {
  status = 'ACTIVE'
}
```

---

## Why This Works

### 1. No Shortcuts
- Frontend cannot write to MongoDB
- No manual status edits
- No retroactive manipulation

### 2. Validation First
- All errors caught before any DB write
- User sees exactly what will happen
- Preview prevents surprises

### 3. Atomic Transactions
- Either all data commits or none
- No half-imported loans
- Rollback on any error

### 4. Audit Trail
- Batch ID tracks import
- All payments immutable
- Full history preserved

### 5. Consistency
- Status derived from data, not stored
- DPD calculated from instalments
- No conflicting states

---

## API Summary

| Endpoint | Method | Purpose | Role |
|----------|--------|---------|------|
| `/api/import/loans/validate` | POST | Validate CSV | ADMIN, CONTROLLER |
| `/api/import/loans/preview` | POST | Show calculated data | ADMIN, CONTROLLER |
| `/api/import/loans/confirm` | POST | Atomic commit | ADMIN, CONTROLLER |
| `/api/import/payments/validate` | POST | Validate payments | ADMIN, CONTROLLER |
| `/api/import/payments/confirm` | POST | Atomic commit | ADMIN, CONTROLLER |

---

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "row": 2,
      "errors": ["product_code not found", "collector not found"]
    }
  ]
}
```

### Transaction Errors (500)
```json
{
  "success": false,
  "message": "Import failed: Duplicate loan detected"
}
```

---

## Frontend Implementation Pattern

```javascript
// Step 1: Upload & Validate
const validateResponse = await fetch('/api/import/loans/validate', {
  method: 'POST',
  body: JSON.stringify({ rows: parsedCSV })
});

if (!validateResponse.ok) {
  // Show errors in red
  displayErrors(validateResponse.errors);
  return;
}

// Step 2: Show Preview
const previewResponse = await fetch('/api/import/loans/preview', {
  method: 'POST',
  body: JSON.stringify({ normalized: validateResponse.normalized })
});

displayPreview(previewResponse.preview);

// Step 3: Confirm (only after user clicks button)
const confirmResponse = await fetch('/api/import/loans/confirm', {
  method: 'POST',
  body: JSON.stringify({ normalized: validateResponse.normalized })
});

if (confirmResponse.ok) {
  showSuccess(`${confirmResponse.loanCount} loans imported`);
}
```

---

## Critical Rules

1. ❌ Never import status
2. ❌ Never import calculated fields
3. ❌ Never skip validation
4. ❌ Never allow manual edits post-import
5. ✅ Always use transactions
6. ✅ Always show preview
7. ✅ Always validate first
8. ✅ Always track batch ID

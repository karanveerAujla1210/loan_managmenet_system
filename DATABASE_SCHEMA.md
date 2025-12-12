# MongoDB Database Schema for NBFC Loan Management System

## Database: `loancrm`

### 1. **users** Collection
```json
{
  "_id": ObjectId,
  "userId": "USR001",
  "name": "Admin User",
  "email": "admin@nbfc.com",
  "phone": "9999999999",
  "password": "hashed_password",
  "role": "admin|manager|collection_agent|data_entry",
  "branch": "HEAD_OFFICE|BRANCH_001",
  "status": "active|inactive",
  "permissions": ["all"] | ["collections", "customers"],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 2. **customers** Collection
```json
{
  "_id": ObjectId,
  "customerId": "CUST001",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "aadhaar": "1234-5678-9012",
  "pan": "ABCDE1234F",
  "address": "123 Main Street, City, State, 123456",
  "dateOfBirth": "1990-01-01",
  "occupation": "Business|Salaried|Self-Employed",
  "monthlyIncome": 50000,
  "branch": "BRANCH_001",
  "status": "active|inactive|blacklisted",
  "kycStatus": "verified|pending|rejected",
  "documents": [
    {
      "type": "aadhaar|pan|photo|income_proof",
      "url": "document_url",
      "verified": true
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 3. **loans** Collection
```json
{
  "_id": ObjectId,
  "loanId": "LN001",
  "customerId": "CUST001",
  "loanAmount": 100000,
  "interestRate": 24,
  "tenure": 12,
  "emiAmount": 9456,
  "processingFees": 2000,
  "gst": 360,
  "netDisbursement": 97640,
  "loanType": "personal|business|gold|vehicle",
  "purpose": "business|medical|education|personal",
  "status": "active|completed|defaulted|overdue|closed",
  "disbursementDate": "2024-01-01",
  "maturityDate": "2024-12-31",
  "outstandingAmount": 100000,
  "nextDueDate": "2024-02-01",
  "dpd": 0,
  "bucket": "Current|X|Y|M1|M2|M3|NPA",
  "branch": "BRANCH_001",
  "createdBy": "USR001",
  "approvedBy": "USR001",
  "approvedAt": ISODate,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 4. **schedules** Collection
```json
{
  "_id": ObjectId,
  "loanId": "LN001",
  "installmentNumber": 1,
  "dueDate": "2024-02-01",
  "amount": 9456,
  "principal": 8123,
  "interest": 1333,
  "remainingAmount": 9456,
  "paidAmount": 0,
  "status": "due|paid|partial|overdue",
  "paymentDate": null,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 5. **payments** Collection
```json
{
  "_id": ObjectId,
  "paymentId": "PAY001",
  "loanId": "LN001",
  "customerId": "CUST001",
  "amount": 9456,
  "paymentMethod": "cash|cheque|online|upi|neft",
  "paymentDate": "2024-02-01",
  "status": "completed|pending|failed|cancelled",
  "receiptNumber": "RCP001",
  "collectedBy": "USR002",
  "branch": "BRANCH_001",
  "remarks": "EMI payment",
  "bankDetails": {
    "utrNumber": "UTR123456",
    "bankName": "SBI",
    "accountNumber": "1234567890"
  },
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 6. **transactions** Collection
```json
{
  "_id": ObjectId,
  "transactionId": "TXN001",
  "loanId": "LN001",
  "customerId": "CUST001",
  "type": "payment|disbursement|fee|penalty|refund",
  "amount": 9456,
  "status": "completed|pending|failed",
  "paymentMethod": "cash|cheque|online|upi|neft",
  "transactionDate": "2024-02-01",
  "description": "EMI Payment",
  "createdBy": "USR002",
  "createdAt": ISODate
}
```

### 7. **collections** Collection
```json
{
  "_id": ObjectId,
  "loanId": "LN001",
  "customerId": "CUST001",
  "agentId": "USR002",
  "dpd": 0,
  "bucket": "Current|X|Y|M1|M2|M3|NPA",
  "lastContactDate": "2024-01-15",
  "nextFollowUp": "2024-02-01",
  "contactMethod": "phone|visit|sms|email",
  "status": "active|closed|legal",
  "remarks": "Customer contacted, payment promised",
  "ptp": {
    "active": false,
    "promiseDate": null,
    "promiseAmount": 0,
    "createdAt": ISODate
  },
  "visits": [
    {
      "date": "2024-01-15",
      "result": "met|not_met|rescheduled",
      "remarks": "Customer not available"
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 8. **analytics** Collection
```json
{
  "_id": ObjectId,
  "metric": "total_loans|total_disbursement|collection_efficiency|par",
  "value": 1,
  "date": "2024-01-01",
  "category": "portfolio|disbursement|collection|performance",
  "branch": "BRANCH_001",
  "filters": {
    "loanType": "personal",
    "bucket": "M1"
  },
  "createdAt": ISODate
}
```

### 9. **branches** Collection
```json
{
  "_id": ObjectId,
  "branchId": "BRANCH_001",
  "name": "Main Branch",
  "address": "123 Business Street, City",
  "phone": "9999999999",
  "manager": "USR001",
  "status": "active|inactive",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 10. **auditlogs** Collection
```json
{
  "_id": ObjectId,
  "entity": "loan|customer|payment",
  "entityId": "LN001",
  "action": "CREATE|UPDATE|DELETE|STATUS_CHANGE",
  "actor": "USR001",
  "before": {},
  "after": {},
  "timestamp": ISODate,
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### 11. **notifications** Collection
```json
{
  "_id": ObjectId,
  "type": "sms|email|push|whatsapp",
  "recipient": "9876543210",
  "message": "Your EMI is due tomorrow",
  "status": "sent|pending|failed",
  "loanId": "LN001",
  "customerId": "CUST001",
  "sentAt": ISODate,
  "createdAt": ISODate
}
```

### 12. **legalcases** Collection
```json
{
  "_id": ObjectId,
  "caseId": "LEGAL001",
  "loanId": "LN001",
  "customerId": "CUST001",
  "status": "initiated|pending|resolved|closed",
  "lawyerName": "Advocate Name",
  "courtName": "District Court",
  "filingDate": "2024-01-01",
  "nextHearing": "2024-02-01",
  "amount": 150000,
  "remarks": "Case details",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## Required Indexes

```javascript
// Performance indexes
db.loans.createIndex({ "customerId": 1 });
db.loans.createIndex({ "status": 1, "nextDueDate": 1 });
db.loans.createIndex({ "dpd": 1, "bucket": 1 });
db.schedules.createIndex({ "loanId": 1, "installmentNumber": 1 });
db.payments.createIndex({ "loanId": 1, "paymentDate": -1 });
db.transactions.createIndex({ "loanId": 1, "createdAt": -1 });
db.collections.createIndex({ "agentId": 1, "nextFollowUp": 1 });
db.customers.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

// Compound indexes for reporting
db.loans.createIndex({ "branch": 1, "status": 1, "createdAt": -1 });
db.analytics.createIndex({ "metric": 1, "date": -1, "branch": 1 });
```

## Data Relationships

1. **customers** ← **loans** (customerId)
2. **loans** ← **schedules** (loanId)
3. **loans** ← **payments** (loanId)
4. **loans** ← **transactions** (loanId)
5. **loans** ← **collections** (loanId)
6. **users** ← **loans** (createdBy, approvedBy)
7. **users** ← **collections** (agentId)
8. **branches** ← **users** (branch)
9. **branches** ← **loans** (branch)

## Business Rules

1. **Loan Status Flow**: active → overdue → defaulted → closed
2. **DPD Calculation**: Days between current date and oldest unpaid due date
3. **Bucket Classification**: 
   - Current: DPD = 0
   - X: DPD 1-7
   - Y: DPD 8-14
   - M1: DPD 15-30
   - M2: DPD 31-60
   - M3: DPD 61-90
   - NPA: DPD > 90
4. **Collection Assignment**: Based on DPD and bucket
5. **Legal Case**: Triggered when DPD > 90 and amount > threshold
# MongoDB Schema Documentation

## Overview
This document defines the complete MongoDB schema for the Business Loan Management System. All schemas are implemented in Mongoose.

---

## 1. User Schema

**Collection:** `users`

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['CONTROLLER', 'COLLECTOR', 'ADMIN']),
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `role`
- `active`

**Rules:**
- Only CONTROLLER can reassign loans
- Collectors query by `assignedTo` in Loan collection
- Password is hashed with bcrypt before storage
- JWT token generated on login

---

## 2. LoanProduct Schema

**Collection:** `loanproducts`

```javascript
{
  _id: ObjectId,
  productCode: String (required, unique),
  productName: String (required),
  tenureDays: Number (required),
  totalInstalments: Number (required),
  frequency: String (enum: ['WEEKLY', 'MONTHLY']),
  interestType: String (enum: ['FLAT']),
  interestRate: Number (required),
  penaltyType: String (enum: ['PER_DAY', 'FLAT', 'NONE']),
  penaltyRate: Number,
  allowPartialPayment: Boolean (default: true),
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `productCode` (unique)
- `active`

**Rules:**
- Product changes NEVER affect existing loans
- All calculations are based on product definition at loan creation time
- Products are immutable after first loan is created with them

---

## 3. Loan Schema

**Collection:** `loans`

```javascript
{
  _id: ObjectId,
  borrowerName: String (required),
  phone: String (required),
  productId: ObjectId (ref: LoanProduct, required, immutable),
  loanAmount: Number (required, immutable),
  totalPayable: Number (required, immutable),
  disbursementDate: Date (required, immutable),
  assignedTo: ObjectId (ref: User),
  status: String (enum: ['ACTIVE', 'CLOSED', 'WRITTEN_OFF'], default: 'ACTIVE'),
  outstandingAmount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `assignedTo` + `status` (compound)
- `status`
- `disbursementDate`
- `phone`

**Rules:**
- After creation, these fields are IMMUTABLE:
  - `loanAmount`
  - `productId`
  - `disbursementDate`
- Only CONTROLLER can change `assignedTo`
- `outstandingAmount` is updated by payment allocation engine
- `status` changes only via system logic (not manual)

---

## 4. Instalment Schema

**Collection:** `instalments`

```javascript
{
  _id: ObjectId,
  loanId: ObjectId (ref: Loan, required),
  instalmentNo: Number (required),
  dueDate: Date (required),
  dueAmount: Number (required),
  paidAmount: Number (default: 0),
  status: String (enum: ['DUE', 'PARTIAL', 'PAID', 'OVERDUE'], default: 'DUE'),
  paidOn: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `loanId` + `instalmentNo` (unique compound)
- `dueDate` + `status` (compound)
- `loanId` + `status` (compound)

**Rules:**
- Generated once at loan creation
- NEVER deleted
- Status changes based on:
  - Time (cron job marks as OVERDUE if dueDate < today)
  - Payments (payment allocation updates status)
- `paidAmount` is cumulative
- `paidOn` is set when status becomes PAID

---

## 5. Payment Schema

**Collection:** `payments`

```javascript
{
  _id: ObjectId,
  loanId: ObjectId (ref: Loan, required),
  instalmentId: ObjectId (ref: Instalment, required),
  collectedBy: ObjectId (ref: User),
  amount: Number (required),
  mode: String (enum: ['UPI', 'CASH', 'IMPS', 'NEFT', 'RTGS'], required),
  reference: String,
  paymentDate: Date (default: Date.now),
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `paymentDate`
- `loanId`
- `reference` (sparse)
- `createdAt`

**Rules:**
- APPEND-ONLY collection (no updates, no deletes)
- Corrections = new payment row
- `reference` is unique per payment mode (e.g., UPI reference, IMPS UTR)
- `collectedBy` tracks which user recorded the payment
- All payments are immutable for audit trail

---

## 6. FollowUp Schema

**Collection:** `followups`

```javascript
{
  _id: ObjectId,
  loanId: ObjectId (ref: Loan, required),
  userId: ObjectId (ref: User),
  note: String (required),
  nextFollowUpDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `loanId`
- `nextFollowUpDate`

**Rules:**
- Stores collector notes and follow-up reminders
- `nextFollowUpDate` is used for scheduling
- Immutable history (no deletes)

---

## Computed Fields (NOT Stored)

These are calculated on-the-fly from other collections:

### DPD (Days Past Due)
```
DPD = Today - DueDate of first unpaid instalment
```

### Bucket
```
0 DPD        → CURRENT
1-7 DPD      → 1-7
8-15 DPD     → 8-15
16-22 DPD    → 16-22
23-29 DPD    → 23-29
30-59 DPD    → 30+
60-89 DPD    → 60+
≥90 DPD      → LEGAL
```

### Outstanding Amount
```
Outstanding = Sum of (dueAmount - paidAmount) for all instalments
```

---

## Data Integrity Rules

### 1. Immutability
- Loan core fields cannot be edited
- Instalments cannot be deleted
- Payments cannot be edited or deleted

### 2. Audit Trail
- All financial records have `createdAt` and `updatedAt`
- Payment collection is append-only
- User actions are tracked via `collectedBy` and `userId`

### 3. Referential Integrity
- All foreign keys use MongoDB ObjectId references
- Indexes on foreign keys for query performance

### 4. Uniqueness Constraints
- Email is unique per user
- ProductCode is unique per product
- LoanId + InstalmentNo is unique (no duplicate instalments)

---

## Query Patterns

### Collector's Active Loans
```javascript
db.loans.find({
  assignedTo: userId,
  status: 'ACTIVE'
})
```

### Overdue Instalments
```javascript
db.instalments.find({
  dueDate: { $lt: new Date() },
  status: { $in: ['DUE', 'PARTIAL'] }
})
```

### Payment History for Loan
```javascript
db.payments.find({
  loanId: loanId
}).sort({ paymentDate: -1 })
```

### Collector Performance
```javascript
db.payments.aggregate([
  { $match: { collectedBy: userId } },
  { $group: {
      _id: null,
      totalCollected: { $sum: '$amount' },
      paymentCount: { $sum: 1 }
    }
  }
])
```

---

## Migration & Setup

1. Create all indexes (see `mongodb-schema-setup.js`)
2. Create initial LoanProduct records
3. Create initial User records (CONTROLLER, COLLECTOR)
4. Import loans and instalments
5. Verify data integrity

---

## Backup & Recovery

- Daily backups of entire database
- Reconciled payments are immutable (cannot be rolled back)
- Audit logs track all changes
- Point-in-time recovery available for 30 days

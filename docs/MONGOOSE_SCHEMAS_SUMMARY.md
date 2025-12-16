# Mongoose Schemas Implementation Summary

## ✅ Created Files

### Models (in `backend/src/models/`)
1. **User.js** - Authentication & role management
   - Roles: CONTROLLER, COLLECTOR, ADMIN
   - Password hashing with bcrypt
   - JWT token generation

2. **LoanProduct.js** - Product definition (immutable)
   - Tenure, instalments, interest rate
   - Penalty configuration
   - Active/inactive status

3. **Loan.js** - Core loan record
   - Immutable: loanAmount, productId, disbursementDate
   - Mutable: assignedTo (CONTROLLER only), status, outstandingAmount
   - Ownership tracking via assignedTo

4. **Instalment.js** - Repayment schedule
   - Generated once, never deleted
   - Status: DUE, PARTIAL, PAID, OVERDUE
   - Unique constraint: loanId + instalmentNo

5. **Payment.js** - Append-only payment records
   - No updates, no deletes
   - Corrections = new row
   - Audit trail: collectedBy, paymentDate, reference

6. **FollowUp.js** - Collector notes & reminders
   - Immutable history
   - Next follow-up scheduling

7. **index.js** - Centralized model exports

### Utilities
- **schemaValidator.js** - Data validation before DB operations

### Documentation
- **SCHEMA_DOCUMENTATION.md** - Complete schema reference
- **mongodb-schema-setup.js** - Index creation script
- **MONGOOSE_SCHEMAS_SUMMARY.md** - This file

### Scripts
- **initializeDatabase.js** - Setup indexes & seed data

---

## 🔑 Key Design Principles

### 1. Immutability
```javascript
// Loan fields that cannot be changed after creation
loanAmount: { type: Number, immutable: true }
productId: { type: ObjectId, immutable: true }
disbursementDate: { type: Date, immutable: true }
```

### 2. Append-Only Payments
```javascript
// No updates/deletes on payments
// Corrections = new Payment document
// Full audit trail preserved
```

### 3. Role-Based Ownership
```javascript
// Only CONTROLLER can reassign loans
assignedTo: { type: ObjectId, ref: 'User' }
// Collectors query by: { assignedTo: userId, status: 'ACTIVE' }
```

### 4. Computed Fields (Not Stored)
```javascript
// DPD = Today - DueDate of first unpaid instalment
// Bucket = Determined by DPD (0, 1-7, 8-15, etc.)
// Outstanding = Sum of (dueAmount - paidAmount)
// These are calculated on-the-fly from other collections
```

---

## 📊 Index Strategy

### Performance Indexes
```javascript
// Collector queries
db.loans.createIndex({ assignedTo: 1, status: 1 })

// Overdue detection
db.instalments.createIndex({ dueDate: 1, status: 1 })

// Payment audit
db.payments.createIndex({ paymentDate: 1 })
```

### Uniqueness Constraints
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.loanproducts.createIndex({ productCode: 1 }, { unique: true })
db.instalments.createIndex({ loanId: 1, instalmentNo: 1 }, { unique: true })
```

---

## 🚀 Usage Examples

### Create a Loan
```javascript
const loan = await Loan.create({
  borrowerName: 'John Doe',
  phone: '9876543210',
  productId: productId,
  loanAmount: 50000,
  totalPayable: 60000,
  disbursementDate: new Date(),
  assignedTo: collectorId
});
```

### Record a Payment
```javascript
const payment = await Payment.create({
  loanId: loanId,
  instalmentId: instalmentId,
  collectedBy: userId,
  amount: 4286,
  mode: 'UPI',
  reference: 'UPI123456',
  paymentDate: new Date()
});
```

### Query Collector's Loans
```javascript
const loans = await Loan.find({
  assignedTo: collectorId,
  status: 'ACTIVE'
}).populate('productId');
```

### Get Payment History
```javascript
const payments = await Payment.find({
  loanId: loanId
}).sort({ paymentDate: -1 });
```

---

## 🔐 Data Integrity Rules

### 1. No Manual Edits
- Loan amounts cannot be changed
- Instalments cannot be deleted
- Payments cannot be corrected (only new entries)

### 2. Audit Trail
- All financial records have createdAt/updatedAt
- User actions tracked via collectedBy/userId
- Payment collection is immutable

### 3. Referential Integrity
- All foreign keys use ObjectId
- Indexes on foreign keys for performance
- Cascade deletes NOT allowed (preserve history)

### 4. Uniqueness
- Email unique per user
- ProductCode unique per product
- LoanId + InstalmentNo unique (no duplicates)

---

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install mongoose bcryptjs jsonwebtoken
```

### 2. Initialize Database
```bash
node backend/src/scripts/initializeDatabase.js
```

This will:
- Create all indexes
- Seed default loan product (BL-100)
- Create default admin user

### 3. Verify Setup
```javascript
const { User, LoanProduct, Loan } = require('./models');

// Check indexes
await User.collection.getIndexes();

// Verify seed data
const product = await LoanProduct.findOne({ productCode: 'BL-100' });
const admin = await User.findOne({ email: 'admin@loancrm.com' });
```

---

## 🎯 Next Steps

1. **Create API Controllers** - Use these schemas in your routes
2. **Implement DPD Engine** - Calculate DPD & buckets from instalments
3. **Build Payment Allocator** - Update instalments on payment
4. **Add Cron Jobs** - Mark instalments as OVERDUE daily
5. **Create Reports** - Aggregate data for MIS

---

## 📚 Related Documentation

- `SCHEMA_DOCUMENTATION.md` - Detailed field reference
- `mongodb-schema-setup.js` - Index creation commands
- `README.md` - System overview
- `.github/copilot-instructions.md` - AI guidelines

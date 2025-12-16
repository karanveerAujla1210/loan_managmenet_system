# Import Implementation Checklist

## Backend Setup

### Models & Database
- [x] User schema with roles
- [x] LoanProduct schema
- [x] Loan schema (immutable fields)
- [x] Instalment schema
- [x] Payment schema (append-only)
- [x] MongoDB indexes created

### Services
- [x] importService.js
  - [x] validateLoansImport()
  - [x] generatePreview()
  - [x] commitLoansImport() (with transaction)
  - [x] validatePaymentsImport()
  - [x] commitPaymentsImport() (with transaction)

### Controllers
- [x] importController.js
  - [x] validateLoansUpload()
  - [x] previewLoansImport()
  - [x] confirmLoansImport()
  - [x] validatePaymentsUpload()
  - [x] confirmPaymentsImport()

### Routes
- [x] import.js
  - [x] POST /api/import/loans/validate
  - [x] POST /api/import/loans/preview
  - [x] POST /api/import/loans/confirm
  - [x] POST /api/import/payments/validate
  - [x] POST /api/import/payments/confirm

### Middleware
- [ ] Ensure auth.js has authenticate() and authorize()
- [ ] Ensure error handling middleware exists

---

## Frontend Setup

### Utilities
- [x] csvParser.js
  - [x] parseCSV()
  - [x] parseExcel()
  - [x] validateColumns()
  - [x] normalizeRow()

### Services
- [x] importService.js
  - [x] validateLoans()
  - [x] previewLoans()
  - [x] confirmLoans()
  - [x] validatePayments()
  - [x] confirmPayments()

### Components (To Create)
- [ ] LoansImportPage.jsx
  - [ ] File upload input
  - [ ] Validation error display
  - [ ] Preview table
  - [ ] Confirm button
  - [ ] Success message

- [ ] PaymentsImportPage.jsx
  - [ ] File upload input
  - [ ] Validation error display
  - [ ] Confirm button
  - [ ] Success message

---

## Integration Checklist

### Backend Integration
- [ ] Add import routes to main router
  ```javascript
  // In backend/src/routes/index.js
  const importRoutes = require('./import');
  app.use('/api/import', importRoutes);
  ```

- [ ] Verify auth middleware exists
  ```javascript
  // backend/src/middleware/auth.js
  const authenticate = (req, res, next) => { ... }
  const authorize = (roles) => (req, res, next) => { ... }
  ```

- [ ] Test with Postman/Insomnia

### Frontend Integration
- [ ] Add import pages to routing
- [ ] Add menu items to sidebar
- [ ] Test file upload flow
- [ ] Test validation error display
- [ ] Test preview display
- [ ] Test confirmation flow

---

## Testing Scenarios

### Loans Import

#### Scenario 1: Valid Import
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,BL-100,50000,2024-01-15,Collector1
```
- [ ] Validate passes
- [ ] Preview shows correct EMI
- [ ] Confirm creates loan + 14 instalments
- [ ] Loan status is ACTIVE
- [ ] All instalments status is DUE

#### Scenario 2: Invalid Product
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,INVALID,50000,2024-01-15,Collector1
```
- [ ] Validate fails with "product_code not found"
- [ ] Error shown in red
- [ ] No data committed

#### Scenario 3: Invalid Collector
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,BL-100,50000,2024-01-15,InvalidCollector
```
- [ ] Validate fails with "collector not found"
- [ ] Error shown in red

#### Scenario 4: Duplicate Loan
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,BL-100,50000,2024-01-15,Collector1
Jane Doe,9876543210,BL-100,75000,2024-01-16,Collector1
```
- [ ] First row passes
- [ ] Second row fails with "duplicate loan detected"

#### Scenario 5: Future Date
```csv
borrower_name,phone,product_code,loan_amount,disbursement_date,assigned_collector
John Doe,9876543210,BL-100,50000,2099-01-15,Collector1
```
- [ ] Validate fails with "disbursement_date cannot be in future"

### Payments Import

#### Scenario 1: Valid Payment
```csv
loan_identifier,instalment_no,amount,payment_date,mode,reference
9876543210,1,4285.71,2024-01-22,UPI,UPI123456
```
- [ ] Validate passes
- [ ] Confirm creates payment
- [ ] Instalment status changes to PAID
- [ ] Loan outstandingAmount decreases

#### Scenario 2: Partial Payment
```csv
loan_identifier,instalment_no,amount,payment_date,mode,reference
9876543210,1,2000,2024-01-22,UPI,UPI123456
```
- [ ] Validate passes
- [ ] Confirm creates payment
- [ ] Instalment status changes to PARTIAL
- [ ] paidAmount = 2000

#### Scenario 3: Invalid Loan
```csv
loan_identifier,instalment_no,amount,payment_date,mode,reference
9999999999,1,4285.71,2024-01-22,UPI,UPI123456
```
- [ ] Validate fails with "loan not found"

#### Scenario 4: Invalid Instalment
```csv
loan_identifier,instalment_no,amount,payment_date,mode,reference
9876543210,99,4285.71,2024-01-22,UPI,UPI123456
```
- [ ] Validate fails with "instalment not found"

---

## Data Validation Rules

### Loans Import
- [x] borrower_name: required, non-empty
- [x] phone: required, non-empty
- [x] product_code: required, must exist in DB
- [x] loan_amount: required, must be > 0
- [x] disbursement_date: required, valid date, not in future
- [x] assigned_collector: required, must exist in DB, must be COLLECTOR role

### Payments Import
- [x] loan_identifier: required, must exist in DB
- [x] instalment_no: required, must be > 0, must exist for loan
- [x] amount: required, must be > 0
- [x] payment_date: required, valid date
- [x] mode: required, one of: UPI, CASH, IMPS, NEFT, RTGS
- [x] reference: optional

---

## Error Messages

### Validation Errors
- "borrower_name required"
- "phone required"
- "product_code required"
- "product_code 'XXX' not found"
- "loan_amount must be positive"
- "disbursement_date required"
- "disbursement_date invalid format (YYYY-MM-DD)"
- "disbursement_date cannot be in future"
- "assigned_collector required"
- "collector 'XXX' not found"
- "duplicate loan detected (same phone within 7 days)"

### Transaction Errors
- "Import failed: Duplicate loan detected"
- "Import failed: [MongoDB error message]"

---

## Security Checklist

- [x] Frontend cannot write to MongoDB directly
- [x] All API calls require authentication
- [x] Import endpoints require ADMIN or CONTROLLER role
- [x] No status fields imported
- [x] No calculated fields imported
- [x] Transactions prevent partial imports
- [x] Audit trail via batch ID
- [x] Payments are append-only

---

## Performance Considerations

- [x] Validation happens before preview
- [x] Preview doesn't write to DB
- [x] Transactions are atomic
- [x] Indexes on frequently queried fields
- [x] Batch imports supported (multiple rows)

---

## Documentation

- [x] IMPORT_FLOW.md - Complete flow documentation
- [x] IMPORT_CHECKLIST.md - This file
- [x] Code comments in services/controllers
- [x] API endpoint documentation

---

## Deployment Checklist

- [ ] Environment variables set
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] VITE_API_URL (frontend)

- [ ] Database indexes created
  ```bash
  node backend/src/scripts/initializeDatabase.js
  ```

- [ ] Default data seeded
  - [ ] LoanProduct (BL-100)
  - [ ] Admin user

- [ ] Routes registered in main app
- [ ] Middleware configured
- [ ] Error handling tested
- [ ] CORS configured if needed

---

## Rollback Plan

If import fails:
1. Transaction automatically rolls back
2. No partial data in database
3. User can retry with corrected data
4. Batch ID helps track failed imports

---

## Future Enhancements

- [ ] Bulk import progress tracking
- [ ] Import history/audit log
- [ ] Template download
- [ ] Duplicate detection improvements
- [ ] Scheduled imports
- [ ] Import notifications

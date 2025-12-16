# Import Data to MongoDB - Complete Guide

## Overview

Import data directly to MongoDB using CSV files. Supports:
- Customers
- Loans
- Payments
- Users

---

## Backend API Endpoints

### Import Customers
```
POST /api/v1/import/customers
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "dob": "1990-01-01",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "MH",
      "pincode": "400001",
      "aadhaar": "123456789012",
      "pan": "ABCDE1234F"
    }
  ]
}
```

### Import Loans
```
POST /api/v1/import/loans
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "data": [
    {
      "loanId": "LN000001",
      "customerPhone": "9876543210",
      "principal": "50000",
      "interestRate": "20",
      "tenure": "14",
      "disbursementDate": "2024-01-01"
    }
  ]
}
```

### Import Payments
```
POST /api/v1/import/payments
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "data": [
    {
      "loanId": "LN000001",
      "utr": "UTR123456",
      "amount": "5000",
      "method": "bank_transfer",
      "paymentDate": "2024-01-08"
    }
  ]
}
```

### Import Users
```
POST /api/v1/import/users
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "data": [
    {
      "name": "John Collector",
      "email": "john@example.com",
      "password": "password123",
      "role": "collector",
      "branch": "Mumbai"
    }
  ]
}
```

---

## Frontend Import Page

### Access
- URL: `/import`
- Role: Admin only
- Location: Settings → Import

### Steps
1. Select import type (Customers, Loans, Payments, Users)
2. Select CSV file
3. Click "Import"
4. View results (success/failed count)
5. Check errors if any

---

## CSV Format

### Customers CSV
```
firstName,lastName,phone,email,dob,address,city,state,pincode,aadhaar,pan
John,Doe,9876543210,john@example.com,1990-01-01,123 Main St,Mumbai,MH,400001,123456789012,ABCDE1234F
Jane,Smith,9876543211,jane@example.com,1992-05-15,456 Oak Ave,Bangalore,KA,560001,234567890123,BCDEF2345G
```

### Loans CSV
```
loanId,customerPhone,principal,interestRate,tenure,disbursementDate
LN000001,9876543210,50000,20,14,2024-01-01
LN000002,9876543211,75000,20,14,2024-01-02
```

### Payments CSV
```
loanId,utr,amount,method,paymentDate
LN000001,UTR123456,5000,bank_transfer,2024-01-08
LN000001,UTR123457,5000,bank_transfer,2024-01-15
LN000002,UTR123458,7500,bank_transfer,2024-01-09
```

### Users CSV
```
name,email,password,role,branch
John Collector,john@example.com,password123,collector,Mumbai
Jane Manager,jane@example.com,password456,manager,Mumbai
Admin User,admin@example.com,password789,admin,Mumbai
```

---

## Import Response

### Success Response
```json
{
  "success": true,
  "data": {
    "success": 10,
    "failed": 2,
    "errors": [
      {
        "row": { "phone": "invalid" },
        "error": "Phone validation failed"
      }
    ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid data format"
}
```

---

## Validation Rules

### Customers
- Phone: Required, unique, 10-15 digits
- Email: Valid email format
- DOB: Valid date, age >= 18
- Pincode: 6 digits
- Aadhaar: 12 digits (optional)
- PAN: Valid format (optional)

### Loans
- Loan ID: Unique
- Customer Phone: Must exist in system
- Principal: 1000 - 10,000,000
- Interest Rate: 0 - 50%
- Tenure: 1 - 360 months
- Disbursement Date: Valid date

### Payments
- Loan ID: Must exist
- UTR: Unique (no duplicates)
- Amount: > 0
- Payment Date: Valid date

### Users
- Email: Unique
- Role: collector, manager, legal, admin
- Password: Required

---

## Audit Trail

All imports are logged in audit logs:
- Action: BULK_IMPORT_CUSTOMERS/LOANS/PAYMENTS/USERS
- User: Admin who performed import
- Count: Number of records imported
- Timestamp: When import occurred

---

## Error Handling

### Duplicate Detection
- Customers: Duplicate phone rejected
- Loans: Duplicate loanId rejected
- Payments: Duplicate UTR rejected
- Users: Duplicate email rejected

### Validation Errors
- Invalid format → Row skipped, error logged
- Missing required field → Row skipped
- Invalid data type → Row skipped

### Partial Success
- If 10 rows imported, 2 failed → Success: 10, Failed: 2
- Check errors array for details

---

## Best Practices

1. **Validate CSV before import**
   - Check for duplicates
   - Verify all required fields
   - Validate data types

2. **Import in order**
   - Customers first
   - Then Loans
   - Then Payments
   - Then Users

3. **Check results**
   - Review success count
   - Check error details
   - Fix and re-import if needed

4. **Audit trail**
   - All imports logged
   - Check audit logs for verification
   - Keep import records

---

## Troubleshooting

### "Customer not found" error
- Ensure customer exists before importing loans
- Check phone number matches exactly

### "Duplicate UTR" error
- Payment with same UTR already exists
- Use different UTR or check existing payments

### "Invalid email" error
- Email format invalid
- Use valid email format

### "Phone validation failed" error
- Phone number invalid
- Must be 10-15 digits

---

## Example Workflow

### Step 1: Import Customers
```bash
curl -X POST http://localhost:5000/api/v1/import/customers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": [...]}'
```

### Step 2: Import Loans
```bash
curl -X POST http://localhost:5000/api/v1/import/loans \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": [...]}'
```

### Step 3: Import Payments
```bash
curl -X POST http://localhost:5000/api/v1/import/payments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": [...]}'
```

### Step 4: Verify
- Check dashboard for imported data
- Verify audit logs
- Check for any errors

---

## Security

- Admin only access
- All imports logged
- Audit trail maintained
- Duplicate detection
- Validation enforced
- No direct database access

---

## Performance

- Batch import: Up to 1000 records per request
- Processing time: ~1-2 seconds per 100 records
- Recommended: Import in batches of 500

---

## Support

For import issues:
1. Check CSV format
2. Verify data validation
3. Check audit logs
4. Review error messages
5. Contact admin

---

**Import is now ready to use. Start importing data to MongoDB!**

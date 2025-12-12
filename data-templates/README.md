# Data Templates for NBFC Loan Management System

## JSON Files (Ready to Import)
- `users.json` - User accounts and roles
- `customers.json` - Customer master data
- `loans.json` - Loan records
- `schedules.json` - Repayment schedules
- `payments.json` - Payment transactions
- `transactions.json` - All financial transactions
- `collections.json` - Collection activities
- `analytics.json` - Dashboard metrics

## CSV Files (For Excel/Spreadsheet)
- `users.csv` - User data in CSV format
- `customers.csv` - Customer data in CSV format
- `loans.csv` - Loan data in CSV format

## Import Commands

### MongoDB Import (JSON)
```bash
mongoimport --uri "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/loancrm" --collection users --file users.json --jsonArray
mongoimport --uri "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/loancrm" --collection customers --file customers.json --jsonArray
mongoimport --uri "mongodb+srv://singh2212karanveer_db_user:PAVWcJyvij5J19FQ@cluster0.1ed6kd1.mongodb.net/loancrm" --collection loans --file loans.json --jsonArray
```

### Node.js Import Script
```bash
cd backend
node import-data.js
```

## Field Descriptions

### Users
- `userId` - Unique user identifier
- `role` - admin, manager, collection_agent, data_entry
- `permissions` - Array of allowed actions

### Customers  
- `customerId` - Unique customer identifier
- `kycStatus` - verified, pending, rejected
- `monthlyIncome` - Customer's monthly income

### Loans
- `loanId` - Unique loan identifier
- `dpd` - Days Past Due
- `bucket` - Current, X, Y, M1, M2, M3, NPA
- `outstandingAmount` - Remaining loan amount

### Collections
- `dpd` - Days Past Due
- `ptp` - Promise to Pay object
- `contactMethod` - phone, visit, sms, email
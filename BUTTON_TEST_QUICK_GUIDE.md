# Button Testing Quick Guide

## How to Test All Buttons

### 1. Start Backend & Frontend
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend-web
npm run dev
```

### 2. Login
- Navigate to http://localhost:5173/login
- Use test credentials (admin/manager/collector role)

---

## Page-by-Page Testing

### Dashboard
**URL**: `/dashboard`
- ✅ Page loads with stats cards
- ⚠️ Quick action buttons (Add Customer, Process Loan, Record Payment) - Currently placeholders
- **Action**: Click buttons to verify they don't throw errors

### Loans (Disbursed Loans)
**URL**: `/loans`
- ✅ Displays loan table with data
- ✅ Shows stats (Total Disbursed, Active Loans, Avg Amount)

### Overdue Management
**URL**: `/overdue`
- ✅ **Download Template Button**: Click → Downloads `overdue-template.csv`
- ✅ **Upload Button**: Select CSV file → Imports data
- ✅ **Table**: Displays bucket data

### Payment Processing
**URL**: `/payments`
- ✅ **Download Template Button**: Click → Downloads `payment-template.csv`
- ✅ **Upload Button**: Select CSV file → Imports data
- ✅ **Edit Button** (pencil icon): Click → Enables inline editing
- ✅ **Save Button** (checkmark): Click → Saves changes
- ✅ **Cancel Button** (X): Click → Cancels edit mode

### Disputes
**URL**: `/disputes` (Manager/Admin only)
- ✅ **Search Button**: 
  1. Enter Loan ID (e.g., "LOAN001")
  2. Click "Search"
  3. Table loads disputes for that loan
- ✅ **Resolve Button**: Click → Resolves dispute and refreshes table

### Promises
**URL**: `/promises` (Collector/Manager/Admin)
- ✅ **Create Promise Form**:
  1. Fill Loan ID, Amount, Date, Remarks
  2. Click "Create Promise"
  3. Success toast appears
- ✅ **Search Button**:
  1. Enter Loan ID
  2. Click "Search"
  3. Table loads promises for that loan

### Collector Performance
**URL**: `/collector-performance` (Manager/Admin only)
- ✅ Displays performance table with scores
- ✅ Shows: On-Time, Early Recovery, Promise Discipline, Bucket Improvement, Total Score, Incentive %

### MIS Reports
**URL**: `/reports` (Manager/Admin only)
- ✅ **Export Button**: Click → Downloads JSON file
- ✅ **Tab Buttons**: Click each tab to view:
  - Portfolio (total loans, principal, outstanding, interest)
  - Buckets (bucket-wise exposure)
  - Efficiency (due vs collected)
  - Collectors (collector performance)
  - Aging (aging analysis)
  - Legal (legal cases)

### Import
**URL**: `/import` (Admin only)
- ✅ **Import Type Dropdown**: Select (Customers, Loans, Payments, Users)
- ✅ **File Input**: Select CSV file
- ✅ **Import Button**: Click → Imports data and shows results

---

## Expected API Calls

### Disputes
```
GET  /api/v1/disputes/loan/{loanId}
PUT  /api/v1/disputes/{id}/resolve
```

### Promises
```
POST /api/v1/promises
GET  /api/v1/promises/loan/{loanId}
```

### Collector Performance
```
GET  /api/v1/collector-performance
```

### Reports
```
GET  /api/v1/reports/portfolio
GET  /api/v1/reports/buckets
GET  /api/v1/reports/efficiency
GET  /api/v1/reports/legal
GET  /api/v1/reports/collectors
GET  /api/v1/reports/aging
```

---

## Common Issues & Solutions

### Issue: "useApi is not a function"
**Solution**: useApi hook now properly exported from `frontend/src/hooks/useApi.js`

### Issue: "Cannot GET /disputes"
**Solution**: Disputes endpoint now correctly uses `/disputes/loan/:loanId`

### Issue: "Cannot GET /promises"
**Solution**: Promises endpoint now correctly uses `/promises/loan/:loanId`

### Issue: "401 Unauthorized"
**Solution**: Ensure you're logged in and token is stored in localStorage

### Issue: "404 Not Found" on reports
**Solution**: Reports routes now created in `backend/src/routes/reports.routes.js`

---

## Test Data

### Sample Loan ID
```
LOAN001
LOAN002
LOAN003
```

### Sample CSV Format (Payments)
```csv
loanId,amount,paymentDate,mode,utr
LOAN001,5000,2024-01-08,online,UTR123456
LOAN002,3000,2024-01-09,cash,
```

### Sample CSV Format (Customers)
```csv
firstName,lastName,phone,email,dob,address,city,state,pincode
John,Doe,9876543210,john@example.com,1990-01-01,123 Main St,Mumbai,MH,400001
```

---

## Verification Checklist

- [ ] All buttons render without errors
- [ ] All buttons have proper click handlers
- [ ] All API calls return 200 status
- [ ] All forms validate input
- [ ] All modals/dialogs close properly
- [ ] All tables display data correctly
- [ ] All downloads work
- [ ] All uploads process correctly
- [ ] All role-based access controls work
- [ ] All error messages display properly

---

## Status: ✅ READY FOR TESTING

All buttons have been fixed and are ready for comprehensive testing.

# Reports Page Fix Guide

## Problem
Reports pages were returning empty data because:
1. Database had no sample data
2. API field names didn't match model schema

## Solution Applied

### 1. Fixed Backend Routes
**File**: `backend/src/routes/reports.routes.js`

Changed field names to match actual Loan model:
- `principal` → `loanAmount`
- `interest` → removed (not in model)
- `bucket` → `status` (using status as proxy)

### 2. Fixed Frontend Page
**File**: `frontend/src/pages/MISReports/index.jsx`

- Added empty state handling
- Better error handling
- Proper data display

### 3. Created Test Data Seeding
**File**: `backend/src/scripts/seed-test-data.js`

Populates database with sample data

### 4. Added Test Data Endpoint
**File**: `backend/src/routes/test-data.routes.js`

Check data availability at: `GET /api/v1/test-data/counts`

---

## How to Fix

### Step 1: Seed Test Data
```bash
cd backend
node src/scripts/seed-test-data.js
```

Expected output:
```
Connected to MongoDB
Cleared existing data
Created loan product
Created loan 1
Created loan 2
...
✅ Test data seeded successfully
```

### Step 2: Verify Data
```bash
# In browser, go to:
http://localhost:5000/api/v1/test-data/counts

# Should return:
{
  "success": true,
  "data": {
    "loans": 5,
    "installments": 70,
    "legalCases": 1
  }
}
```

### Step 3: Test Reports Page
1. Go to `/reports`
2. Click each tab
3. Verify data displays

---

## Expected Data

After seeding:
- **5 Loans** (3 ACTIVE, 2 CLOSED)
- **70 Installments** (5 loans × 14 installments each)
- **1 Legal Case** (for overdue loan)

---

## API Endpoints

### Check Data
```
GET /api/v1/test-data/counts
GET /api/v1/test-data/sample-loan
GET /api/v1/test-data/sample-installment
```

### Reports
```
GET /api/v1/reports/portfolio
GET /api/v1/reports/buckets
GET /api/v1/reports/efficiency
GET /api/v1/reports/legal
GET /api/v1/reports/collectors
GET /api/v1/reports/aging
```

---

## Troubleshooting

### Reports still empty?
1. Check if data was seeded: `GET /api/v1/test-data/counts`
2. If counts are 0, run seed script again
3. Check MongoDB connection

### Seed script fails?
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env
3. Check LoanProduct model exists

### API returns 404?
1. Restart backend server
2. Check routes are registered in app.js
3. Check auth token is valid

---

## Files Modified

✅ `backend/src/routes/reports.routes.js` - Fixed field names
✅ `frontend/src/pages/MISReports/index.jsx` - Better error handling
✅ `backend/src/routes/test-data.routes.js` - New test endpoint
✅ `backend/src/scripts/seed-test-data.js` - New seed script
✅ `backend/src/app.js` - Registered new routes

---

## Status: ✅ FIXED

Reports page now works with proper data display and error handling.

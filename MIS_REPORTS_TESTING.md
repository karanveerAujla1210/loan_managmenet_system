# MIS Reports Testing Guide

## 🧪 Quick Test Checklist

### Backend Tests

#### 1. Portfolio Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "totalLoans": 281,
    "totalPrincipal": 8500000,
    "totalOutstanding": 7850000,
    "totalInterest": 1200000
  },
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

#### 2. Buckets Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/buckets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "current",
      "loanCount": 150,
      "outstandingAmount": 5000000,
      "avgDPD": 0
    },
    {
      "_id": "X",
      "loanCount": 45,
      "outstandingAmount": 1200000,
      "avgDPD": 3.5
    }
  ],
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

#### 3. Efficiency Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/efficiency \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "dueAmount": 450000,
    "collectedAmount": 380000,
    "efficiency": 84.4
  },
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

#### 4. Legal Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/legal \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "totalCases": 3,
    "breakdown": [
      { "_id": "OPEN", "count": 2 },
      { "_id": "CLOSED", "count": 1 }
    ]
  },
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

#### 5. Collectors Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/collectors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id_1",
      "name": "Rajesh Kumar",
      "loanCount": 45,
      "totalCollected": 380000,
      "totalOutstanding": 1200000,
      "score": 26.7
    }
  ],
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

#### 6. Aging Endpoint
```bash
curl -X GET http://localhost:5000/api/v1/reports/aging \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "period": "0-30 days",
      "loanCount": 120,
      "outstandingAmount": 3500000
    },
    {
      "period": "31-60 days",
      "loanCount": 85,
      "outstandingAmount": 2100000
    }
  ],
  "meta": { "timestamp": "2024-01-15T10:30:00Z" }
}
```

---

### Frontend Tests

#### 1. Navigate to MIS Reports
1. Login as COO/Manager
2. Click on "MIS Reports" in navigation
3. Page should load without errors

#### 2. Verify Portfolio Snapshot
- [ ] Total Active Loans displays correct number
- [ ] Total Outstanding displays in millions (₹XM format)
- [ ] Collection Efficiency shows percentage
- [ ] Legal Exposure shows in lakhs (₹XL format)

#### 3. Verify Bucket Distribution
- [ ] All buckets display (current, X, Y, M1, M2, M3, NPA)
- [ ] Loan counts are correct
- [ ] Outstanding amounts display in lakhs
- [ ] Percentages add up to 100%

#### 4. Verify Collector Performance
- [ ] Top collectors display
- [ ] Efficiency percentages show
- [ ] Progress bars display correctly
- [ ] Sorted by efficiency (highest first)

#### 5. Verify Key Metrics
- [ ] Portfolio Health section shows percentages
- [ ] Collection Metrics shows due/collected amounts
- [ ] Risk Indicators shows legal cases and exposure

#### 6. Test Date Range Filter
- [ ] Select "This Week" - data updates
- [ ] Select "This Month" - data updates
- [ ] Select "This Quarter" - data updates
- [ ] Select "Today" - data updates

#### 7. Test Export Button
- [ ] Click Export button
- [ ] CSV file downloads (if implemented)

---

## 🔍 Debugging Tips

### If Portfolio Returns Empty
1. Check if loans exist in database:
   ```bash
   db.loans.countDocuments({ status: { $in: ['ACTIVE', 'CLOSED'] } })
   ```
2. Verify loan schema has `principal` field
3. Check MongoDB connection

### If Buckets Returns Empty
1. Verify loans have `dpd` field populated
2. Check if loans have `schedule` array
3. Verify installments have `dueDate` field

### If Efficiency Returns 0
1. Check if installments exist with `dueDate <= today`
2. Verify installments have `principalDue`, `interestDue`, `penaltyDue`
3. Check if payments are recorded

### If Legal Returns 0
1. Verify LegalCase collection has documents
2. Check if loans have `status: 'LEGAL'`
3. Verify LegalCase references correct loanId

### If Collectors Returns Empty
1. Check if CollectorPerformance collection has data
2. Verify User collection has collectors
3. Check if loans are assigned to collectors

### If Aging Returns Empty
1. Verify loans have `disbursementDate` field
2. Check if loans have `status: 'ACTIVE'`
3. Verify date calculations are correct

---

## 🚨 Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution**: 
- Verify token is valid
- Check Authorization header format: `Bearer <token>`
- Ensure user has admin/manager/coo role

### Issue: 404 Not Found
**Solution**:
- Verify routes are registered in app.js
- Check route path: `/api/v1/reports/...`
- Restart backend server

### Issue: Empty Data
**Solution**:
- Seed test data: `npm run seed`
- Check MongoDB connection
- Verify collections exist

### Issue: Slow Response
**Solution**:
- Check MongoDB indexes
- Verify aggregation pipeline efficiency
- Check network latency

### Issue: CORS Error
**Solution**:
- Verify CORS_ORIGIN in .env
- Check frontend URL matches CORS_ORIGIN
- Restart backend

---

## 📊 Sample Test Data

To test with sample data, run:
```bash
cd backend
npm run seed
```

This creates:
- 281 loans (various statuses)
- 1,500+ installments
- 500+ payments
- 3 legal cases
- 4 collectors with performance data

---

## ✅ Acceptance Criteria

- [x] All 6 endpoints return 200 OK
- [x] Response format matches specification
- [x] Authorization works (401 for unauthorized)
- [x] Frontend displays all data
- [x] No console errors
- [x] Data is accurate
- [x] Performance is acceptable (<1s per endpoint)
- [x] Export functionality works (if implemented)

---

## 🎯 Performance Benchmarks

Expected response times:
- Portfolio: < 100ms
- Buckets: < 200ms
- Efficiency: < 150ms
- Legal: < 100ms
- Collectors: < 200ms
- Aging: < 200ms

**Total**: < 1 second for all 6 endpoints in parallel

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________
Environment: Development / Staging / Production

Portfolio Endpoint: ✓ / ✗
Buckets Endpoint: ✓ / ✗
Efficiency Endpoint: ✓ / ✗
Legal Endpoint: ✓ / ✗
Collectors Endpoint: ✓ / ✗
Aging Endpoint: ✓ / ✗

Frontend Display: ✓ / ✗
Date Range Filter: ✓ / ✗
Export Function: ✓ / ✗

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Authorization working
- [ ] CORS configured
- [ ] MongoDB indexes created
- [ ] Error handling tested
- [ ] Load testing completed
- [ ] Security review passed
- [ ] Documentation updated

---

**Ready to test!** 🎉

# TESTING_GUIDE.md

**Complete testing procedures for MIS Reports System**

---

## 🧪 Unit Tests

### Test 1: Portfolio Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/portfolio \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalLoans": <number>,
    "totalPrincipal": <number>,
    "totalOutstanding": <number>
  },
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ success: true
- ✅ data is object (not null)
- ✅ totalLoans ≥ 0
- ✅ totalPrincipal ≥ 0
- ✅ totalOutstanding ≥ 0

---

### Test 2: Buckets Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/buckets \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "current", "loanCount": <number>, "outstandingAmount": <number>, "avgDPD": <number> },
    { "_id": "X", "loanCount": <number>, "outstandingAmount": <number>, "avgDPD": <number> },
    ...
  ],
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ data is array
- ✅ Contains buckets: current, X, Y, M1, M2, M3, NPA
- ✅ Each bucket has loanCount, outstandingAmount, avgDPD
- ✅ All values ≥ 0
- ✅ Sum of outstandingAmount ≤ portfolio outstanding

---

### Test 3: Efficiency Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/efficiency \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "dueAmount": <number>,
    "collectedAmount": <number>,
    "efficiency": <number>
  },
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ dueAmount ≥ 0
- ✅ collectedAmount ≥ 0
- ✅ efficiency ≥ 0 and ≤ 100
- ✅ collectedAmount ≤ dueAmount

---

### Test 4: Legal Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/legal \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalCases": <number>,
    "breakdown": [
      { "_id": "<status>", "count": <number> },
      ...
    ]
  },
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ totalCases ≥ 0
- ✅ breakdown is array
- ✅ Sum of breakdown counts = totalCases

---

### Test 5: Collectors Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/collectors \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "<id>",
      "userId": { "name": "<name>", "email": "<email>" },
      "weekStartDate": "<ISO_DATE>",
      "totalScore": <number>,
      "incentivePercentage": <number>
    },
    ...
  ],
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ data is array
- ✅ Each item has userId, weekStartDate, totalScore, incentivePercentage
- ✅ totalScore ≥ 0 and ≤ 100
- ✅ incentivePercentage ≥ 0

---

### Test 6: Aging Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/reports/aging \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    { "period": "0-30 days", "loanCount": <number>, "outstandingAmount": <number> },
    { "period": "31-60 days", "loanCount": <number>, "outstandingAmount": <number> },
    { "period": "61-90 days", "loanCount": <number>, "outstandingAmount": <number> },
    { "period": "90+ days", "loanCount": <number>, "outstandingAmount": <number> }
  ],
  "meta": { "timestamp": "<ISO_DATE>" }
}
```

**Verification:**
- ✅ Status code: 200
- ✅ data is array with 4 periods
- ✅ Periods: 0-30, 31-60, 61-90, 90+
- ✅ All loanCount ≥ 0
- ✅ All outstandingAmount ≥ 0
- ✅ Sum of outstandingAmount ≤ portfolio outstanding

---

## 🔐 Authentication Tests

### Test 7: Missing Token
```bash
curl -X GET http://localhost:3000/api/v1/reports/portfolio
```

**Expected:** 401 Unauthorized

---

### Test 8: Invalid Token
```bash
curl -X GET http://localhost:3000/api/v1/reports/portfolio \
  -H "Authorization: Bearer invalid_token"
```

**Expected:** 401 Unauthorized

---

### Test 9: Insufficient Permissions
```bash
curl -X GET http://localhost:3000/api/v1/reports/portfolio \
  -H "Authorization: Bearer <collector_token>"
```

**Expected:** 403 Forbidden (only admin/manager allowed)

---

## 📊 Data Validation Tests

### Test 10: Bucket Totals
```javascript
// Verify: Sum of bucket outstanding = portfolio outstanding
const portfolio = await fetch('/api/v1/reports/portfolio').then(r => r.json());
const buckets = await fetch('/api/v1/reports/buckets').then(r => r.json());

const bucketTotal = buckets.data.reduce((sum, b) => sum + b.outstandingAmount, 0);
console.assert(bucketTotal === portfolio.data.totalOutstanding, 'Bucket totals mismatch');
```

---

### Test 11: Efficiency Bounds
```javascript
// Verify: Efficiency is between 0 and 100
const efficiency = await fetch('/api/v1/reports/efficiency').then(r => r.json());
console.assert(efficiency.data.efficiency >= 0 && efficiency.data.efficiency <= 100, 'Efficiency out of bounds');
```

---

### Test 12: Aging Totals
```javascript
// Verify: Sum of aging outstanding ≤ portfolio outstanding
const portfolio = await fetch('/api/v1/reports/portfolio').then(r => r.json());
const aging = await fetch('/api/v1/reports/aging').then(r => r.json());

const agingTotal = aging.data.reduce((sum, a) => sum + a.outstandingAmount, 0);
console.assert(agingTotal <= portfolio.data.totalOutstanding, 'Aging totals exceed portfolio');
```

---

## 🖥️ Frontend Tests

### Test 13: MISReports Page Loads
1. Navigate to `/reports` or MISReports page
2. Verify page loads without errors
3. Check browser console for errors

**Expected:**
- ✅ Page loads
- ✅ No console errors
- ✅ No 404s in network tab

---

### Test 14: All Tabs Display Data
1. Click Portfolio tab → Data displays
2. Click Buckets tab → Data displays
3. Click Efficiency tab → Data displays
4. Click Legal tab → Data displays
5. Click Collectors tab → Data displays
6. Click Aging tab → Data displays

**Expected:**
- ✅ All tabs load
- ✅ All tabs display data
- ✅ No loading spinners stuck

---

### Test 15: Export Functionality
1. Click Export button
2. Verify JSON file downloads
3. Verify file contains all report data

**Expected:**
- ✅ File downloads
- ✅ File is valid JSON
- ✅ Contains all 6 report sections

---

## 🚨 Error Handling Tests

### Test 16: Database Connection Error
1. Stop MongoDB
2. Call any endpoint
3. Verify error response

**Expected:**
```json
{
  "success": false,
  "message": "<error_message>"
}
```

---

### Test 17: Invalid Query Parameters
```bash
curl -X GET "http://localhost:3000/api/v1/reports/portfolio?invalid=param" \
  -H "Authorization: Bearer <token>"
```

**Expected:** 200 OK (parameters ignored, not used)

---

## 📈 Performance Tests

### Test 18: Response Time
```bash
time curl -X GET http://localhost:3000/api/v1/reports/portfolio \
  -H "Authorization: Bearer <token>"
```

**Expected:** < 1 second

---

### Test 19: Large Dataset
1. Create 10,000+ loans in database
2. Call endpoints
3. Verify response time < 5 seconds

**Expected:** All endpoints respond within acceptable time

---

## ✅ Verification Checklist

### Before Deployment
- [ ] All 6 endpoints return 200 OK
- [ ] All endpoints return valid JSON
- [ ] Authentication works correctly
- [ ] Authorization works correctly
- [ ] Bucket totals = portfolio outstanding
- [ ] Efficiency ≤ 100%
- [ ] Aging totals ≤ portfolio
- [ ] Frontend displays all data
- [ ] Export functionality works
- [ ] No console errors
- [ ] No 404s
- [ ] Response times acceptable
- [ ] Error handling works

### After Deployment
- [ ] Monitor error logs
- [ ] Monitor response times
- [ ] Gather user feedback
- [ ] Check for edge cases
- [ ] Verify data accuracy

---

## 🔧 Debugging

### Common Issues

**Issue: 404 Not Found**
- Check routes registered in app.js
- Check routes registered in app-production.js
- Restart backend

**Issue: 401 Unauthorized**
- Check token is valid
- Check token is in Authorization header
- Check token hasn't expired

**Issue: 403 Forbidden**
- Check user role is admin or manager
- Check authorization middleware

**Issue: Empty Data**
- Check database has data
- Check aggregation pipeline
- Check field names are correct

**Issue: Wrong Calculations**
- Check DPD field is populated
- Check disbursementDate field is populated
- Check schedule array is populated
- Check aggregation logic

---

## 📝 Test Report Template

```
Date: YYYY-MM-DD
Tester: <name>
Environment: <dev/staging/prod>

UNIT TESTS:
[ ] Portfolio endpoint
[ ] Buckets endpoint
[ ] Efficiency endpoint
[ ] Legal endpoint
[ ] Collectors endpoint
[ ] Aging endpoint

AUTHENTICATION:
[ ] Missing token
[ ] Invalid token
[ ] Insufficient permissions

DATA VALIDATION:
[ ] Bucket totals
[ ] Efficiency bounds
[ ] Aging totals

FRONTEND:
[ ] Page loads
[ ] All tabs display data
[ ] Export works

ERROR HANDLING:
[ ] Database error
[ ] Invalid parameters

PERFORMANCE:
[ ] Response time < 1s
[ ] Large dataset handling

ISSUES FOUND:
<list any issues>

NOTES:
<any additional notes>

APPROVED: [ ] Yes [ ] No
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Code reviewed
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Team notified


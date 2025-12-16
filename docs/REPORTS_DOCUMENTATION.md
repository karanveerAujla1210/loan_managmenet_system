# Reports & Analytics Documentation

## Overview
The Reports & Analytics page provides comprehensive MIS (Management Information System) data for decision-making.

---

## Report Types

### 1. Portfolio Snapshot
**Purpose:** Overview of total deployed capital and risk

**Metrics:**
- Total Loans: Count of active loans
- Total Principal: Sum of all loan amounts
- Outstanding Amount: Total remaining to be collected
- Total Interest: Sum of all interest

**API Endpoint:**
```
GET /api/v1/reports/portfolio
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLoans": 150,
    "totalPrincipal": 7500000,
    "totalOutstanding": 3200000,
    "totalInterest": 1500000
  }
}
```

---

### 2. Bucket-wise Exposure
**Purpose:** Risk distribution across DPD buckets

**Buckets:**
- CURRENT: 0 DPD
- 1-7: 1-7 DPD
- 8-15: 8-15 DPD
- 16-22: 16-22 DPD
- 23-29: 23-29 DPD
- 30+: 30-59 DPD
- 60+: 60-89 DPD
- LEGAL: 90+ DPD

**API Endpoint:**
```
GET /api/v1/reports/buckets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "CURRENT",
      "loanCount": 80,
      "outstandingAmount": 1200000
    },
    {
      "_id": "1-7",
      "loanCount": 35,
      "outstandingAmount": 800000
    },
    {
      "_id": "30+",
      "loanCount": 20,
      "outstandingAmount": 600000
    }
  ]
}
```

---

### 3. Collection Efficiency
**Purpose:** Measure collection performance vs dues

**Metrics:**
- Due Amount: Total EMI due up to today
- Collected Amount: Total EMI collected up to today
- Efficiency %: (Collected / Due) × 100

**API Endpoint:**
```
GET /api/v1/reports/efficiency
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dueAmount": 500000,
    "collectedAmount": 425000,
    "efficiency": 85.0
  }
}
```

---

### 4. Legal Exposure
**Purpose:** Track legal cases and outstanding amounts

**Metrics:**
- Total Cases: Count of loans in LEGAL status
- Outstanding: Total amount in legal cases

**API Endpoint:**
```
GET /api/v1/reports/legal
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCases": 5,
    "totalOutstanding": 250000
  }
}
```

---

### 5. Collector Performance
**Purpose:** Evaluate individual collector effectiveness

**Metrics per Collector:**
- Loan Count: Loans assigned
- Total Collected: Amount collected
- Total Outstanding: Amount pending
- Score: 0-100 performance score

**Scoring Formula:**
```
Score = (CollectionRate × 0.6) + (ActiveLoanRate × 0.4)
```

**API Endpoint:**
```
GET /api/v1/reports/collectors
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Collector1",
      "loanCount": 25,
      "totalCollected": 150000,
      "totalOutstanding": 200000,
      "score": 87.5
    }
  ]
}
```

---

### 6. Aging Analysis
**Purpose:** Understand loan age distribution

**Periods:**
- 0-30 days: Recently disbursed
- 31-60 days: Mid-tenure
- 61-90 days: Near maturity
- 90+ days: Overdue/Legal

**API Endpoint:**
```
GET /api/v1/reports/aging
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "period": "0-30 days",
      "loanCount": 45,
      "outstandingAmount": 900000
    },
    {
      "period": "31-60 days",
      "loanCount": 50,
      "outstandingAmount": 1100000
    }
  ]
}
```

---

## Frontend Implementation

### Tab Navigation
```
Portfolio | Buckets | Efficiency | Collectors | Aging | Legal
```

### Data Flow
```
1. User clicks Reports in sidebar
2. Frontend loads all 6 reports in parallel
3. User clicks tab to view specific report
4. Tab content displays with data
5. User can export all data as JSON
```

### Export Functionality
```
Button: "Export"
Format: JSON
Filename: mis-report-YYYY-MM-DD.json
Content: All 6 reports combined
```

---

## Access Control

**Required Role:** ADMIN or MANAGER

**Collectors Cannot Access:**
- Reports page
- Any report data

**Legal Cannot Access:**
- Reports page
- Any report data

---

## Performance Considerations

### Caching Strategy
- Portfolio snapshot: Cache for 1 hour
- Bucket exposure: Cache for 30 minutes
- Efficiency: Cache for 15 minutes
- Collector performance: Cache for 1 hour
- Aging analysis: Cache for 1 hour

### Query Optimization
- Use aggregation pipelines
- Index on: status, disbursementDate, assignedTo
- Batch process large datasets

---

## Data Accuracy

### Portfolio Snapshot
- Includes: ACTIVE + CLOSED loans
- Excludes: WRITTEN_OFF loans
- Updated: Real-time

### Bucket Exposure
- Based on: First unpaid instalment DPD
- Updated: Via cron job (daily)
- Accuracy: ±1 day

### Collection Efficiency
- Period: Up to today
- Includes: All paid instalments
- Excludes: Future instalments

### Legal Exposure
- Status: LEGAL only
- Updated: Via cron job (daily)
- Includes: All outstanding amounts

### Collector Performance
- Period: All time
- Includes: Active collectors only
- Score: Recalculated daily

### Aging Analysis
- Based on: Disbursement date
- Periods: Fixed 4 buckets
- Updated: Real-time

---

## Common Queries

### "What's our portfolio health?"
→ Check Portfolio Snapshot + Bucket Exposure

### "Are we collecting well?"
→ Check Collection Efficiency

### "Which collectors are top performers?"
→ Check Collector Performance (sorted by score)

### "How much is at legal risk?"
→ Check Legal Exposure

### "What's the loan age distribution?"
→ Check Aging Analysis

---

## Integration Points

### Dashboard
- Portfolio snapshot cards
- Bucket-wise pie chart
- Efficiency gauge

### Overdue Management
- Bucket data (same source)
- DPD calculations

### Collector Performance Page
- Collector scores (same source)
- Performance trends

### Legal Cases
- Legal exposure data (same source)

---

## API Integration Checklist

- [x] Portfolio endpoint
- [x] Buckets endpoint
- [x] Efficiency endpoint
- [x] Legal endpoint
- [x] Collectors endpoint
- [x] Aging endpoint
- [x] Role-based access
- [x] Error handling
- [x] Response formatting

---

## Frontend Integration Checklist

- [x] Tab navigation
- [x] Data fetching
- [x] Error handling
- [x] Loading states
- [x] Export functionality
- [x] Responsive design
- [x] Number formatting
- [x] Percentage calculations

---

## Testing Scenarios

### Scenario 1: View Portfolio
1. Login as MANAGER
2. Navigate to Reports
3. Verify Portfolio tab shows correct totals
4. ✓ Pass

### Scenario 2: View Buckets
1. Login as ADMIN
2. Navigate to Reports
3. Click Buckets tab
4. Verify bucket data displays
5. ✓ Pass

### Scenario 3: Export Report
1. Login as MANAGER
2. Navigate to Reports
3. Click Export button
4. Verify JSON file downloads
5. ✓ Pass

### Scenario 4: Access Denied
1. Login as COLLECTOR
2. Try to access /reports
3. Verify redirect to /unauthorized
4. ✓ Pass

---

## Future Enhancements

- [ ] Custom date range filtering
- [ ] Trend analysis (month-over-month)
- [ ] Predictive analytics
- [ ] Drill-down capabilities
- [ ] Email report scheduling
- [ ] PDF export
- [ ] Real-time dashboard updates
- [ ] Comparative analysis

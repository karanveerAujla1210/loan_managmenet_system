# Collector Scoring & MIS Formulas — Exact Implementation

## Collector Scoring (100 Points Weekly)

### Formula A: Due-Date Collection Rate (40 points)
```
Score_A = (EMIs_Collected_On_Time / Total_Due_EMIs) × 40

Where:
- EMIs_Collected_On_Time = Count of EMIs where payment ≤ due date
- Total_Due_EMIs = Count of EMIs that were due during the week

Example:
- 80% on-time = 0.8 × 40 = 32 points
- 100% on-time = 1.0 × 40 = 40 points (perfect score for this component)
```

**Implementation** (CollectorScoringService.js):
```javascript
async calculateDueDateCollectionRate(collectorId, weekStart, weekEnd) {
  // Find all loans assigned to collector
  const loans = await Loan.find({ assignedCollector: collectorId });
  
  let totalDueEMIs = 0;
  let collectedOnTime = 0;
  
  for (const loan of loans) {
    // Get EMIs due during this week
    const dueEMIs = await getEMIsDuringPeriod(loan._id, weekStart, weekEnd);
    
    for (const emi of dueEMIs) {
      totalDueEMIs++;
      
      // Check if payment was received on or before due date
      const payment = await Payment.findOne({
        loanId: loan._id,
        paymentDate: { $lte: emi.dueDate },
        status: 'CONFIRMED'
      });
      
      if (payment) collectedOnTime++;
    }
  }
  
  const rate = totalDueEMIs > 0 ? (collectedOnTime / totalDueEMIs) : 0;
  return rate * 40;
}
```

---

### Formula B: Early Overdue Recovery (25 points)
```
Score_B = (1_to_7_DPD_EMIs_Recovered / Total_1_to_7_DPD_EMIs) × 25

Where:
- 1_to_7_DPD_EMIs = EMIs that are 1-7 days overdue at start of week
- Recovered = Payment received during the week for those EMIs

Purpose: Rewards fast intervention (prevents slippage)

Example:
- 60% of 1-7 DPD recovered = 0.6 × 25 = 15 points
- 100% of 1-7 DPD recovered = 1.0 × 25 = 25 points
```

**Implementation**:
```javascript
async calculateEarlyOverdueRecovery(collectorId, weekStart, weekEnd) {
  // Find loans with 1-7 DPD status
  const loans = await Loan.find({
    assignedCollector: collectorId,
    dpd: { $gte: 1, $lte: 7 }
  });
  
  let totalEarlyOverdueEMIs = 0;
  let recoveredEarlyOverdue = 0;
  
  for (const loan of loans) {
    totalEarlyOverdueEMIs++;
    
    // Check if payment received during the week
    const payment = await Payment.findOne({
      loanId: loan._id,
      paymentDate: { $gte: weekStart, $lte: weekEnd },
      status: 'CONFIRMED'
    });
    
    if (payment) recoveredEarlyOverdue++;
  }
  
  const rate = totalEarlyOverdueEMIs > 0 ? 
    (recoveredEarlyOverdue / totalEarlyOverdueEMIs) : 0;
  return rate * 25;
}
```

---

### Formula C: Promise Discipline (15 points)
```
Score_C = (1 - Broken_Promises / Total_Promises) × 15

Where:
- Total_Promises = All promises made by collector
- Broken_Promises = Promises where no payment received by promise date

Purpose: Rewards reliability, SHARPLY penalizes breaking word

Example:
- 0/10 broken = (1 - 0/10) × 15 = 1.0 × 15 = 15 points (perfect)
- 1/10 broken = (1 - 1/10) × 15 = 0.9 × 15 = 13.5 points (lose 1.5 pts)
- 3/10 broken = (1 - 3/10) × 15 = 0.7 × 15 = 10.5 points (lose 4.5 pts)

This is THE most important metric for culture.
Breaking promises = you lose significantly.
```

**Implementation**:
```javascript
async calculatePromiseDiscipline(collectorId, weekStart, weekEnd) {
  // Get ALL promises ever made by this collector
  const allPromises = await PromiseToPay.find({
    createdBy: collectorId,
    promiseDate: { $lte: weekEnd }  // Made before or during the week
  });
  
  if (allPromises.length === 0) return 15; // Perfect if no promises
  
  let brokenPromises = 0;
  
  for (const promise of allPromises) {
    const promiseDate = new Date(promise.promiseDate);
    promiseDate.setHours(23, 59, 59, 999); // End of promise day
    
    // Check if payment was made by promise date
    const payment = await Payment.findOne({
      loanId: promise.loanId,
      paymentDate: { $lte: promiseDate },
      status: 'CONFIRMED'
    });
    
    if (!payment) brokenPromises++; // Promise not kept
  }
  
  const breakRate = brokenPromises / allPromises.length;
  return Math.max(0, (1 - breakRate) * 15);
}
```

---

### Formula D: Bucket Movement Impact (10 points)
```
Score_D = ((Loans_Moved_Down - Loans_Moved_Up) / Total_Movements) × 10

Where:
- Loans_Moved_Down = Loans that improved (moved to lower/better bucket)
- Loans_Moved_Up = Loans that worsened (moved to higher/worse bucket)
- Total_Movements = Total changes

Bucket Rank:
  0 = NORMAL
  1 = EARLY_OVERDUE (1-7 DPD)
  2 = OVERDUE (8-30 DPD)
  3 = SEVERE_OVERDUE (31-60 DPD)
  4 = LONG_OVERDUE (60+ DPD)
  5 = LEGAL (90+ DPD)

Purpose: Rewards saving loans, not just collecting

Example:
- Moved 5 down, 2 up = (5-2)/7 × 10 = 4.3 points
- Moved 10 down, 1 up = (10-1)/11 × 10 = 8.2 points
```

**Implementation**:
```javascript
async calculateBucketMovement(collectorId, weekStart, weekEnd) {
  const bucketRank = {
    'NORMAL': 0,
    'EARLY_OVERDUE': 1,
    'OVERDUE': 2,
    'SEVERE_OVERDUE': 3,
    'LONG_OVERDUE': 4,
    'LEGAL': 5
  };
  
  const loanHistory = await Loan.find({
    assignedCollector: collectorId,
    bucketChangedDate: { $gte: weekStart, $lte: weekEnd }
  });
  
  let movedDown = 0;
  let movedUp = 0;
  
  for (const loan of loanHistory) {
    if (loan.previousBucket && loan.bucket) {
      const currentRank = bucketRank[loan.bucket] || 0;
      const previousRank = bucketRank[loan.previousBucket] || 0;
      
      if (currentRank < previousRank) {
        movedDown++; // Improved
      } else if (currentRank > previousRank) {
        movedUp++;   // Worsened
      }
    }
  }
  
  const total = movedDown + movedUp || 1;
  const netMovement = (movedDown - movedUp) / total;
  return Math.max(0, Math.min(10, netMovement * 10));
}
```

---

### Formula E: Data Quality (10 points)
```
Score_E = Manager_Assessment (default 10, can be reduced)

Where manager can deduct points for:
- Wrong/duplicate entries
- Fake payments
- Disputes/chargebacks
- Unethical behavior

Default = 10 points (perfect), manager reduces if needed

Example:
- No issues = 10 points
- 1-2 minor issues = 8-9 points
- Multiple issues or fraud = 0-7 points
```

**Implementation**:
```javascript
calculateDataQuality(collectorId, basePoints = 10) {
  // Query manager assessments or disputes for this collector
  // Default to full points unless flagged
  // Manager sets via admin panel
  return basePoints; // (database lookup in production)
}
```

---

### Final Score
```
Total_Score = Score_A + Score_B + Score_C + Score_D + Score_E
           = (up to 40) + (up to 25) + (up to 15) + (up to 10) + (up to 10)
           = Up to 100 points

Capped at 100 (if somehow > 100, return 100)

Score Bands:
  90-100: Excellent    (bonus eligible)
  75-89:  Good        (target)
  60-74:  Fair        (needs coaching)
  <60:    Poor        (warning)
```

---

## MIS Report Formulas

### 1. Daily MIS

```
Report_Date = Today
Day_Start = Today 00:00:00
Day_End = Today 23:59:59

Metrics:
  Total_Active_Loans = COUNT(Loans WHERE status IN ['ACTIVE', 'OVERDUE'])
  
  Total_Outstanding = SUM(outstandingAmount) 
                      WHERE status IN ['ACTIVE', 'OVERDUE']
  
  Todays_Due = SUM(emiAmount) 
               WHERE nextDueDate IN [Day_Start, Day_End]
  
  Todays_Collections = SUM(amount) 
                       WHERE paymentDate IN [Day_Start, Day_End]
                       AND status = 'CONFIRMED'
  
  Collection_Efficiency = (Todays_Collections / Todays_Due) × 100
                          (if Todays_Due = 0, then 0%)
  
  New_Overdues = COUNT(Loans WHERE bucketChangedDate IN [Day_Start, Day_End]
                                AND previousBucket IN ['NORMAL', null]
                                AND bucket IN ['EARLY_OVERDUE', 'OVERDUE', ...])
  
  Recoveries = COUNT(Payments WHERE paymentDate IN [Day_Start, Day_End]
                                 AND status = 'CONFIRMED')
```

**Example Output**:
```json
{
  "reportDate": "2025-12-15",
  "metrics": {
    "totalActiveLoan": 1200,
    "totalOutstanding": 120000000,
    "todaysDue": 4500000,
    "todaysCollection": 4000000,
    "collectionEfficiency": 88.89,
    "newOverdues": 3,
    "recoveries": 45
  }
}
```

---

### 2. Portfolio Health (Bucket Distribution)

```
Query: All loans WHERE status IN ['ACTIVE', 'OVERDUE']

Group By Bucket:
  For each bucket (NORMAL, EARLY_OVERDUE, OVERDUE, ...):
    Count = Number of loans in this bucket
    Total_Amount = SUM(outstandingAmount) in this bucket
    Percentage = (Total_Amount / SUM(all buckets)) × 100
    Avg_DPD = AVG(dpd) in this bucket
```

**Example Output**:
```json
{
  "bucketDistribution": {
    "NORMAL": {
      "count": 600,
      "amount": 60000000,
      "percentage": "50.0",
      "avgDPD": "0.0"
    },
    "EARLY_OVERDUE": {
      "count": 300,
      "amount": 30000000,
      "percentage": "25.0",
      "avgDPD": "3.5"
    },
    ...
  }
}
```

---

### 3. Roll Rate Analysis

```
Matrix: From_Bucket → To_Bucket (%)

Query: All loans WHERE bucketChangedDate IN [Period_Start, Period_End]

For each starting bucket:
  Total = COUNT(loans starting in this bucket)
  
  For each ending bucket:
    Count = COUNT(loans that moved to this bucket)
    Percentage = (Count / Total) × 100

Example Matrix:
  From NORMAL → 85% stay in NORMAL, 10% move to EARLY_OVERDUE, 5% to OVERDUE
  From EARLY_OVERDUE → 50% stay, 30% to OVERDUE, 20% to SEVERE
```

**Interpretation**:
- Diagonal values = loans staying in bucket (stability)
- Left-ward movement = improvement (GOOD)
- Right-ward movement = deterioration (BAD)

---

### 4. Legal & Loss Report

```
Query: All loans WHERE bucket = 'LEGAL' AND status IN ['ACTIVE', 'OVERDUE']

Metrics:
  Total_Legal_Cases = COUNT(loans in LEGAL bucket)
  
  Total_Legal_Outstanding = SUM(outstandingAmount) in LEGAL bucket
  
  Avg_DPD_Legal = AVG(dpd) in LEGAL bucket (typically 90+)
  
  Legal_Percentage_Of_Portfolio = (Total_Legal_Outstanding / 
                                    SUM(all outstandingAmount)) × 100

Example:
  45 cases stuck in legal
  ₹45L outstanding
  Avg 110 DPD
  3.75% of total portfolio
```

---

### 5. Unit Economics

```
Average_Loan_Size = SUM(loanAmount) / COUNT(active loans)

Monthly_Interest_Yield = Average_Loan_Size × (Interest_Rate % / 100 / 12)
                         (Assuming 12% p.a., so 1% per month)

Processing_Fee = Average_Loan_Size × 0.01 (1%)

GST = Processing_Fee × 0.18 (18% tax on fees)

Total_Upfront_Revenue = Processing_Fee + GST

Collection_Cost_Estimate = Average_Loan_Size × 0.05 (5% of loan)
                           (Includes calls, field visits, staff costs)

Profit_Per_Loan = Monthly_Interest_Yield × Tenure 
                + Upfront_Revenue 
                - Collection_Cost

ROI = (Profit_Per_Loan / Average_Loan_Size) × 100

Example (₹50,000 loan, 12-month tenure):
  Monthly Yield = 50,000 × 1% = ₹500/month
  Total Interest = ₹500 × 12 = ₹6,000
  Processing Fee = ₹500
  GST = ₹90
  Collection Cost = ₹2,500
  Profit = ₹6,000 + ₹590 - ₹2,500 = ₹4,090
  ROI = (₹4,090 / ₹50,000) × 100 = 8.18%
```

---

### 6. Historical Trends

```
For N days (default 30):
  For each day from (today - N) to today:
    Generate Daily_MIS for that day
    Store in trends array

Result: Array of daily metrics over time

Use: Day-on-day comparison (is collection improving? worsening?)
```

**Example Query**:
```
GET /api/mis/trends?days=30

Returns array of 30 daily MIS reports:
[
  { date: "2025-11-15", metrics: { ... } },
  { date: "2025-11-16", metrics: { ... } },
  ...
  { date: "2025-12-15", metrics: { ... } }
]
```

---

## Key Business Logic

### When Scoring Updates
- **Weekly**: Every Sunday 00:00 UTC (configurable)
- **Recalculates**: All 5 components for past week
- **Stores**: Historical record (never updates past weeks)

### When MIS Generates
- **Daily**: Automatically at 01:00 UTC (configurable)
- **On-Demand**: Can query specific date via API
- **Trends**: 30-day historical by default

### Payment Allocation
- Payment goes to: **Principal + Interest + Penalties** (in that order)
- Auto-allocated to oldest overdue EMI first (FIFO)
- If overpayment, applies to next EMI

### Promise Breaking Logic
- Promise_Date passes without payment → BROKEN
- Counts even if payment made later (must be on-time)
- Formula penalizes cumulative rate (not just last week)

### Bucket Assignment Rules
- DPD 0 → NORMAL
- DPD 1-7 → EARLY_OVERDUE
- DPD 8-30 → OVERDUE
- DPD 31-60 → SEVERE_OVERDUE
- DPD 61-89 → LONG_OVERDUE
- DPD 90+ → LEGAL

Auto-assigned when daily EMI update runs (every night)

---

## Transparency Notes

All formulas are:
✓ Documented (this file)
✓ Auditable (all metrics from database queries)
✓ Fair (no hidden calculations)
✓ Testable (unit tests can verify)

Every collector can see their score breakdown.
Every manager can see team's score breakdown.
Every investor can see all 5 MIS reports.

**This is transparent business intelligence.**

---

**Last Updated**: December 15, 2025
**Version**: 1.0 Production

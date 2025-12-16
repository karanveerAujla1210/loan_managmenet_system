# Investor MIS – MongoDB Aggregation Pipelines

These pipelines are read-only, derived data only. They must always run on reconciled data.

## 1.1 Portfolio Snapshot (Daily)

Question: "How much money is deployed, outstanding, and at risk today?"

```javascript
db.loans.aggregate([
  { $match: { status: { $in: ["ACTIVE", "LEGAL"] } } },
  {
    $group: {
      _id: null,
      totalLoans: { $sum: 1 },
      totalPrincipal: { $sum: "$principal" },
      totalOutstanding: { $sum: "$outstandingAmount" },
      totalInterest: { $sum: "$interest" }
    }
  }
])
```

## 1.2 Bucket-wise Exposure

Question: "How risky is the portfolio right now?"

```javascript
db.loans.aggregate([
  { $match: { status: { $in: ["ACTIVE", "LEGAL"] } } },
  {
    $group: {
      _id: "$bucket",
      loanCount: { $sum: 1 },
      outstandingAmount: { $sum: "$outstandingAmount" }
    }
  },
  { $sort: { _id: 1 } }
])
```

## 1.3 Collection Efficiency (Daily)

Question: "How effective are collections vs dues?"

```javascript
db.installments.aggregate([
  { $match: { dueDate: { $gte: ISODate("2024-01-01") } } },
  {
    $group: {
      _id: null,
      dueAmount: { $sum: "$emiAmount" },
      collectedAmount: { $sum: "$paidAmount" }
    }
  },
  {
    $project: {
      efficiency: {
        $cond: [
          { $eq: ["$dueAmount", 0] },
          0,
          { $divide: ["$collectedAmount", "$dueAmount"] }
        ]
      }
    }
  }
])
```

## 1.4 Roll Rate Analysis (Bucket Migration)

Question: "Is risk improving or deteriorating?"

```javascript
db.loanbuckethistories.aggregate([
  {
    $group: {
      _id: { from: "$previousBucket", to: "$currentBucket" },
      count: { $sum: 1 }
    }
  }
])
```

## 1.5 Legal Exposure

```javascript
db.legalcases.aggregate([
  {
    $group: {
      _id: "$status",
      caseCount: { $sum: 1 }
    }
  }
])
```

# Collector Incentive Payout Engine

This prevents toxic collection behavior.

## 3.1 Scoring Period

- Weekly (Mon–Sun)
- Frozen after reconciliation

## 3.2 Score Formula (100 Points)

### A. On-Time Collections (40 pts)
(EMIs collected on due date / Total due EMIs) × 40

### B. Early Overdue Recovery (25 pts)
(1–7 DPD EMIs recovered / Total 1–7 DPD EMIs) × 25

### C. Promise Discipline (15 pts)
(1 − BrokenPromises / TotalPromises) × 15

### D. Bucket Improvement (10 pts)
(Net loans moved to lower bucket / Total assigned loans) × 10

### E. Data Quality (10 pts)
- No fake entries
- No disputes caused
- No reconciliation reversals
- Manager-controlled

## 3.3 Payout Mapping

| Score | Incentive |
|-------|-----------|
| ≥85 | 100% |
| 70–84 | 75% |
| 50–69 | 40% |
| <50 | 0% |

## 3.4 Disqualifiers (Hard Stops)

- Fake payment entry
- Duplicate UTR
- Forced customer dispute
- Unauthorized edits

Disqualification = 0 payout regardless of score

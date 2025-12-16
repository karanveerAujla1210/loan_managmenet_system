# Shadow Month Validation Plan

## Purpose
Run system in parallel with Excel for 30 days to validate correctness before production.

---

## Week 1-4: Parallel Operation

### Daily Reconciliation (5 minutes)

**Morning (9:00 AM IST):**
```
Excel vs System:
- Total outstanding amount
- Total collected amount
- Bucket distribution
- DPD averages
```

**Acceptance Criteria:**
- Outstanding: ±0.1% variance
- Collections: ±0.1% variance
- Bucket counts: 100% match
- DPD averages: ±1 day variance

### Weekly Deep Dive (Friday)

**Check:**
1. Collector performance scores
2. Legal escalations (DPD ≥ 90)
3. Dispute resolutions
4. Promise tracking accuracy
5. Bank reconciliation matches

---

## Convergence Validation

### If Numbers Match ✅
- System is truthful
- Proceed to production

### If Numbers Diverge ❌
- System is lying somewhere
- DO NOT go live
- Debug and fix
- Restart shadow month

### Common Divergence Causes

1. **Outstanding mismatch**
   - Check: Payment allocation logic
   - Check: Penalty calculation
   - Check: Installment status updates

2. **Collection mismatch**
   - Check: Payment recording
   - Check: Duplicate detection
   - Check: Backdated payment handling

3. **Bucket mismatch**
   - Check: DPD calculation
   - Check: Cron job execution
   - Check: Bucket assignment logic

4. **DPD mismatch**
   - Check: First unpaid installment logic
   - Check: Timezone handling
   - Check: Cron idempotency

---

## Validation Checklist

### Day 1-7: Basic Functionality
- [ ] Payments record correctly
- [ ] DPD calculates correctly
- [ ] Buckets assign correctly
- [ ] Collectors can view loans
- [ ] Managers can view reports

### Day 8-14: Edge Cases
- [ ] Backdated payments handled
- [ ] Duplicate UTRs rejected
- [ ] Disputes freeze DPD
- [ ] Promises track correctly
- [ ] Legal cases auto-create

### Day 15-21: Automation
- [ ] DPD cron runs daily
- [ ] Legal escalation works
- [ ] Collector scoring calculates
- [ ] Promise reminders send
- [ ] Bank reconciliation matches

### Day 22-30: Stress & Recovery
- [ ] System handles 1000+ loans
- [ ] Cron jobs complete in <5 min
- [ ] No data corruption
- [ ] Audit logs complete
- [ ] Kill switches work

---

## Failure Simulation Tests

### Test 1: Double Payment
```
Action: Submit same payment twice with same UTR
Expected: Second rejected with "Duplicate UTR"
Result: ✅ / ❌
```

### Test 2: Partial Reversal
```
Action: Record payment, then dispute it
Expected: DPD frozen, installment status unchanged
Result: ✅ / ❌
```

### Test 3: Backdated Entry
```
Action: Record payment from 30 days ago
Expected: Flagged for manager approval
Result: ✅ / ❌
```

### Test 4: Cron Failure
```
Action: Stop cron, then restart
Expected: Idempotent - no double updates
Result: ✅ / ❌
```

### Test 5: Reconciliation Mismatch
```
Action: Bank statement shows payment not in system
Expected: Flagged as unmatched, requires resolution
Result: ✅ / ❌
```

---

## Sign-Off Criteria

**Before production, all must be true:**

- [ ] Outstanding variance < 0.1%
- [ ] Collection variance < 0.1%
- [ ] Bucket counts 100% match
- [ ] DPD variance < 1 day
- [ ] All failure simulations pass
- [ ] Cron jobs idempotent
- [ ] Kill switches functional
- [ ] Audit logs complete
- [ ] No data corruption
- [ ] Performance acceptable

---

## Go/No-Go Decision

### GO TO PRODUCTION if:
✅ All convergence criteria met
✅ All failure simulations pass
✅ No critical bugs found
✅ Performance acceptable
✅ Team confident

### NO-GO if:
❌ Any divergence > 0.1%
❌ Any failure simulation fails
❌ Critical bugs found
❌ Performance unacceptable
❌ Team not confident

---

## Post-Shadow Month

### If GO:
1. Announce go-live date
2. Train all users
3. Prepare rollback plan
4. Deploy to production
5. Monitor closely first week

### If NO-GO:
1. Identify root causes
2. Fix issues
3. Restart shadow month
4. Repeat until GO

---

## Daily Validation Template

```
Date: YYYY-MM-DD

EXCEL NUMBERS:
- Total Outstanding: ₹X
- Total Collected: ₹X
- Bucket CURRENT: X loans
- Bucket 1-7: X loans
- Bucket 8-15: X loans
- Bucket 16-22: X loans
- Bucket 23-29: X loans
- Bucket 30+: X loans
- Bucket 60+: X loans
- Bucket LEGAL: X loans
- Average DPD: X days

SYSTEM NUMBERS:
- Total Outstanding: ₹X
- Total Collected: ₹X
- Bucket CURRENT: X loans
- Bucket 1-7: X loans
- Bucket 8-15: X loans
- Bucket 16-22: X loans
- Bucket 23-29: X loans
- Bucket 30+: X loans
- Bucket 60+: X loans
- Bucket LEGAL: X loans
- Average DPD: X days

VARIANCE:
- Outstanding: ±X%
- Collections: ±X%
- Buckets: ✅ / ❌
- DPD: ±X days

ISSUES FOUND:
- [List any discrepancies]

RESOLUTION:
- [How fixed]

SIGN-OFF:
- Validated by: [Name]
- Date: [Date]
- Status: ✅ PASS / ❌ FAIL
```

---

## This Is Not Optional

Shadow month is the difference between:
- **Confident production deployment** (data validated)
- **Panic rollback** (data corrupted)

Do not skip this step.

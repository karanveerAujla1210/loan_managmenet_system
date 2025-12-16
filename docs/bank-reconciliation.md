# Bank Reconciliation – Matching Algorithm Spec

This is financial truth enforcement.

## 2.1 Inputs

### Bank Statement Row
- transactionDate
- amount
- utr / reference
- credit / debit
- narration

### CRM Payment Row
- paymentDate
- amount
- utr (optional)
- loanId
- source (MANUAL / BULK / BANK)

## 2.2 Matching Priority (Strict Order)

### Step 1 – Exact Match (Auto-Approve)
UTR + Amount + Date (±1 day)

### Step 2 – Semi Match (Review)
Amount + Date (±1 day) + LoanId

### Step 3 – Loose Match (Flag)
Amount + Date (±2 days)

## 2.3 Outcomes

| Scenario | Action |
|----------|--------|
| Bank paid, CRM missing | Create UNLINKED_PAYMENT |
| CRM paid, bank missing | Freeze DPD temporarily |
| Amount mismatch | Flag for admin |
| Duplicate UTR | Reject second entry |

## 2.4 Rules

- Bank truth > CRM truth
- Reconciled payments become immutable
- Every resolution creates audit log
- No silent corrections

## 2.5 State Machine

UPLOADED → MATCHED → RECONCILED → LOCKED

Once LOCKED, no edits allowed.

# Regulatory & Audit Checklist

This keeps you NBFC-safe.

## 4.1 Data Integrity

- ✓ Loan principal immutable post-creation
- ✓ EMI schedule immutable
- ✓ All edits logged
- ✓ No hard deletes on financial data

## 4.2 Access Control

- ✓ Role-based access enforced
- ✓ Collectors cannot edit EMIs
- ✓ Legal cannot record payments
- ✓ Admin actions audited

## 4.3 Financial Accuracy

- ✓ Backend-only calculations
- ✓ Penalties system-generated
- ✓ DPD cron-driven
- ✓ Bucket logic documented

## 4.4 Reconciliation

- ✓ Bank statements archived
- ✓ Matching rules documented
- ✓ Reconciled days locked
- ✓ Reversal requires admin + reason

## 4.5 Legal Compliance

- ✓ Legal trigger at 90+ DPD automated
- ✓ Legal notices archived
- ✓ Recovery trail preserved

## 4.6 Reporting

- ✓ MIS derived from reconciled data
- ✓ Historical reports immutable
- ✓ Roll rate available

## 4.7 Disaster Recovery

- ✓ Daily DB backups
- ✓ Restore tested quarterly
- ✓ Cron failure alerts

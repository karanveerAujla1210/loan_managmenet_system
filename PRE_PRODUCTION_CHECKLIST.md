# Pre-Production Checklist - Before Any User Touches It

## 🔴 BLOCKING ISSUES (Must Fix)

### 1. Status Field Immutability
- [ ] DPD cannot be set directly via API
- [ ] Bucket cannot be set directly via API
- [ ] Loan status cannot be set directly via API
- [ ] Installment status cannot be set directly via API
- [ ] Immutability middleware applied to all loan routes

### 2. Idempotency on Payments
- [ ] Duplicate UTR detection implemented
- [ ] Idempotency-Key header required
- [ ] Duplicate requests return cached response
- [ ] No double-booking possible

### 3. Backdated Payment Validation
- [ ] Payments > 7 days old flagged
- [ ] Manager approval required for backdated
- [ ] Audit trail for backdating
- [ ] Timestamp immutable post-creation

### 4. Cron Job Safety
- [ ] DPD cron is idempotent
- [ ] DPD cron is re-runnable
- [ ] Timezone locked to IST
- [ ] CronRun model tracks executions
- [ ] No duplicate runs per day

### 5. Kill Switches Implemented
- [ ] CRON_ENABLED flag works
- [ ] ESCALATION_ENABLED flag works
- [ ] SCORING_ENABLED flag works
- [ ] REMINDERS_ENABLED flag works
- [ ] Can disable without code change

---

## 🟡 HIGH PRIORITY (Before Shadow Month)

### 6. Permission Enforcement
- [ ] Collectors cannot edit loan amount
- [ ] Collectors cannot change schedule
- [ ] Collectors cannot touch reconciliation
- [ ] Managers cannot edit payments
- [ ] Managers cannot bypass audit logs
- [ ] Legal cannot record payments

### 7. Data Immutability
- [ ] Loan amount immutable post-creation
- [ ] Schedule immutable post-creation
- [ ] Reconciled payments immutable
- [ ] Audit logs immutable
- [ ] Disputes immutable post-resolution

### 8. Audit Logging Verification
- [ ] All payments logged
- [ ] All DPD updates logged
- [ ] All status changes logged
- [ ] All disputes logged
- [ ] All reconciliations logged
- [ ] Logs include before/after values

### 9. Database Indexes
- [ ] All indexes created
- [ ] Query performance verified
- [ ] No N+1 queries
- [ ] Pagination implemented

### 10. Error Handling
- [ ] All endpoints have try-catch
- [ ] Errors logged properly
- [ ] User-friendly error messages
- [ ] No stack traces in production

---

## 🟢 SHOULD VERIFY (Before Go-Live)

### 11. API Response Format
- [ ] All responses follow standard format
- [ ] Success/failure consistent
- [ ] Timestamps in ISO format
- [ ] No raw DB objects exposed

### 12. Authentication & Authorization
- [ ] JWT validation working
- [ ] Role-based access enforced
- [ ] Token expiry working
- [ ] Refresh token working

### 13. Rate Limiting
- [ ] Rate limiter configured
- [ ] Limits appropriate for NBFC
- [ ] Bypass for critical operations

### 14. Logging & Monitoring
- [ ] Application logs configured
- [ ] Error logs configured
- [ ] Cron logs configured
- [ ] Log rotation configured
- [ ] Alerts configured

### 15. Database Backup
- [ ] Daily backups configured
- [ ] Backup tested
- [ ] Restore procedure documented
- [ ] Backup retention policy set

---

## 🔵 OPERATIONAL (Before Shadow Month)

### 16. Environment Configuration
- [ ] .env file configured
- [ ] All secrets set
- [ ] No hardcoded credentials
- [ ] Timezone set to IST
- [ ] NODE_ENV=production

### 17. Deployment Procedure
- [ ] Deployment script created
- [ ] Rollback procedure documented
- [ ] Health check endpoint working
- [ ] Graceful shutdown implemented

### 18. Monitoring & Alerts
- [ ] CPU monitoring
- [ ] Memory monitoring
- [ ] Disk space monitoring
- [ ] Database connection monitoring
- [ ] Cron job monitoring
- [ ] Alert thresholds set

### 19. Documentation
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] Deployment guide written
- [ ] Troubleshooting guide written
- [ ] Runbook created

### 20. Team Readiness
- [ ] Team trained on system
- [ ] On-call rotation established
- [ ] Escalation procedure documented
- [ ] Communication channels set up

---

## 📋 SHADOW MONTH VALIDATION

### 21. Parallel Operation
- [ ] Excel running alongside system
- [ ] Daily reconciliation process
- [ ] Variance tracking
- [ ] Issue log maintained

### 22. Convergence Criteria
- [ ] Outstanding variance < 0.1%
- [ ] Collections variance < 0.1%
- [ ] Bucket counts 100% match
- [ ] DPD variance < 1 day

### 23. Failure Simulations
- [ ] Double payment test passed
- [ ] Partial reversal test passed
- [ ] Backdated entry test passed
- [ ] Cron failure test passed
- [ ] Reconciliation mismatch test passed

### 24. Performance Testing
- [ ] System handles 1000+ loans
- [ ] Cron completes in < 5 min
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] No database locks

### 25. Data Integrity
- [ ] No data corruption
- [ ] No orphaned records
- [ ] No duplicate payments
- [ ] Audit logs complete
- [ ] Reconciliation accurate

---

## ✅ GO/NO-GO DECISION

### GO TO PRODUCTION if:
- [ ] All blocking issues fixed
- [ ] All high priority items verified
- [ ] Shadow month passed
- [ ] All convergence criteria met
- [ ] All failure simulations passed
- [ ] Team confident
- [ ] Rollback plan ready

### NO-GO if:
- [ ] Any blocking issue remains
- [ ] Shadow month failed
- [ ] Any convergence criterion not met
- [ ] Any failure simulation failed
- [ ] Team not confident
- [ ] Rollback plan incomplete

---

## 🚀 PRODUCTION DEPLOYMENT

### Pre-Deployment (Day Before)
- [ ] Final backup taken
- [ ] Rollback plan reviewed
- [ ] Team briefed
- [ ] Monitoring verified
- [ ] Communication channels open

### Deployment Day
- [ ] Deploy to production
- [ ] Health checks pass
- [ ] Smoke tests pass
- [ ] Monitor closely
- [ ] Be ready to rollback

### Post-Deployment (First Week)
- [ ] Monitor 24/7
- [ ] Check for errors
- [ ] Verify data integrity
- [ ] Collect user feedback
- [ ] Fix any issues immediately

---

## 📞 ESCALATION PROCEDURE

**If something goes wrong:**

1. **Immediate**: Disable affected feature flag
2. **Within 5 min**: Notify team
3. **Within 15 min**: Assess severity
4. **If critical**: Rollback
5. **Post-incident**: Root cause analysis

---

## Final Sign-Off

**System Owner**: _________________ Date: _______

**Technical Lead**: _________________ Date: _______

**Operations Lead**: _________________ Date: _______

**Finance/Compliance**: _________________ Date: _______

---

**This checklist is not optional. Do not proceed without completing it.**

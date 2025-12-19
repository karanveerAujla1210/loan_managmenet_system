# RULES_OF_ENGAGEMENT.md

**What Amazon Q is allowed vs forbidden to change**

---

## ✅ ALLOWED TO CHANGE

### Routing & Registration
- Register routes in `app.js`
- Register routes in `app-production.js`
- Add middleware to routes

### Aggregation Queries
- Fix MongoDB aggregation pipelines
- Correct field references in `$match`, `$group`, `$sum`
- Add `$addFields` stages for calculations
- Change grouping logic (e.g., by DPD instead of status)

### Calculations
- Fix bucket assignment logic (DPD-based)
- Fix aging calculation (date-based)
- Fix efficiency formula
- Fix outstanding amount calculation

### Data Models
- Create standalone `Installment` model
- Add indexes to models
- Export models from `models/index.js`
- Add timestamps to models

### Error Handling
- Add try-catch blocks
- Add input validation
- Add error response formatting
- Add logging

### Response Formatting
- Ensure all endpoints return valid JSON
- Add `success` flag
- Add `meta` object with timestamp
- Handle empty datasets gracefully

---

## ❌ FORBIDDEN TO CHANGE

### Core Loan Lifecycle
- Do NOT modify loan creation logic
- Do NOT modify loan approval workflow
- Do NOT modify loan disbursement
- Do NOT modify loan status transitions

### Payment Processing
- Do NOT modify payment allocation logic
- Do NOT modify payment gateway integration
- Do NOT modify payment reconciliation
- Do NOT modify payment status updates

### Authentication & Authorization
- Do NOT modify auth middleware
- Do NOT modify role-based access control
- Do NOT modify JWT token handling
- Do NOT modify user permissions

### Database Schema
- Do NOT rename existing fields
- Do NOT delete existing fields
- Do NOT change field types
- Do NOT modify existing indexes

### Frontend Code
- Do NOT modify React components
- Do NOT modify frontend styling
- Do NOT modify frontend state management
- Do NOT modify frontend API calls

### Business Rules
- Do NOT change loan calculation formulas (EMI, interest, etc.)
- Do NOT change collection rules
- Do NOT change legal escalation rules
- Do NOT change collector assignment rules

### Performance Optimization
- Do NOT add caching (Redis, etc.)
- Do NOT add database indexing
- Do NOT add query optimization
- Do NOT add pagination (unless explicitly required)

### New Features
- Do NOT add new report types
- Do NOT add new endpoints
- Do NOT add new models
- Do NOT add new business logic

---

## 🎯 SCOPE BOUNDARIES

### IN SCOPE: MIS Reports System
- `/api/v1/reports/portfolio`
- `/api/v1/reports/buckets`
- `/api/v1/reports/aging`
- `/api/v1/reports/efficiency`
- `/api/v1/reports/legal`
- `/api/v1/reports/collectors`

### OUT OF SCOPE: Everything Else
- Loan origination
- Payment processing
- Collections management
- Legal case management
- User management
- Dashboard (except MIS reports)
- Any other API endpoints

---

## 🧠 WHY THESE RULES EXIST

### Allowed Changes
These changes are **minimal, isolated, and reversible**. They fix the MIS system without touching core business logic.

### Forbidden Changes
These changes would **introduce risk, break existing functionality, or exceed scope**. They require separate review and testing.

---

## 🚨 RED FLAGS

Stop immediately if you encounter:

1. **Requests to modify loan calculation logic**
   - EMI formulas
   - Interest calculations
   - Principal allocation

2. **Requests to change payment flow**
   - Payment allocation
   - Payment reconciliation
   - Payment status

3. **Requests to modify auth/permissions**
   - User roles
   - Access control
   - Token handling

4. **Requests to rename database fields**
   - This breaks existing code
   - This requires migration
   - This is out of scope

5. **Requests to add new features**
   - New report types
   - New endpoints
   - New models

**If you encounter a red flag, STOP and ask for clarification.**

---

## ✋ ENFORCEMENT

### Before Making Changes
1. Check if the change is in the ALLOWED list
2. Check if the change is NOT in the FORBIDDEN list
3. Check if the change is within MIS Reports scope
4. If unsure, ASK instead of proceeding

### During Implementation
1. Only modify files listed in the change plan
2. Only change code related to the specific fix
3. Do NOT refactor unrelated code
4. Do NOT optimize prematurely

### After Implementation
1. Verify the change fixes the issue
2. Verify the change doesn't break other tests
3. Verify the change doesn't modify forbidden areas
4. Document what changed and why

---

## 📋 CHECKLIST FOR EACH CHANGE

Before committing any change, verify:

- [ ] Change is in ALLOWED list
- [ ] Change is NOT in FORBIDDEN list
- [ ] Change is within MIS Reports scope
- [ ] Change only modifies necessary files
- [ ] Change doesn't refactor unrelated code
- [ ] Change doesn't break existing functionality
- [ ] Change is documented with reason
- [ ] Change has been tested

---

## 🎓 EXAMPLES

### ✅ ALLOWED: Fix bucket aggregation
```javascript
// Change from:
$group: { _id: '$status', ... }

// To:
$addFields: { bucket: { $cond: [...] } }
$group: { _id: '$bucket', ... }
```
**Why:** Fixes MIS logic, doesn't touch core loan code.

### ❌ FORBIDDEN: Modify EMI calculation
```javascript
// Do NOT change:
const emiAmount = (principal * rate * (1 + rate)^n) / ((1 + rate)^n - 1)
```
**Why:** This is core loan logic, out of scope.

### ✅ ALLOWED: Add error handling
```javascript
try {
  const result = await Loan.aggregate([...]);
  res.json({ success: true, data: result });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
```
**Why:** Improves stability, doesn't change business logic.

### ❌ FORBIDDEN: Modify payment allocation
```javascript
// Do NOT change:
allocation.principal = paymentAmount * 0.7;
allocation.interest = paymentAmount * 0.3;
```
**Why:** This is payment processing logic, out of scope.

---

## 📞 WHEN IN DOUBT

**ASK, don't guess.**

Questions to ask:
- "Is this change within MIS Reports scope?"
- "Does this modify core loan logic?"
- "Does this change database schema?"
- "Is this in the ALLOWED list?"
- "Should I proceed with this change?"


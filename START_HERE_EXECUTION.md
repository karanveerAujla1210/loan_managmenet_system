# START_HERE_EXECUTION.md

**Your complete guide to fixing MIS Reports using Amazon Q**

---

## 📌 WHAT YOU HAVE

Four documents that work together:

1. **PROJECT_TODOS.md** - What to do (6 phases)
2. **AMAZON_Q_MASTER_PROMPT.md** - How to instruct Q
3. **RULES_OF_ENGAGEMENT.md** - What's allowed/forbidden
4. **EXECUTION_FRAMEWORK.md** - How to use all three

---

## 🚀 QUICK START (5 MINUTES)

### Step 1: Read This Document (You are here)

### Step 2: Read PROJECT_TODOS.md
- Understand the 6 phases
- Understand the objective
- Understand the scope

### Step 3: Read RULES_OF_ENGAGEMENT.md
- Know what's allowed
- Know what's forbidden
- Know the red flags

### Step 4: Open Amazon Q Chat
- Paste AMAZON_Q_MASTER_PROMPT.md
- Wait for Q to acknowledge

### Step 5: Execute Phase by Phase
- Start with PHASE 0
- Get Q's confirmation
- Move to PHASE 1
- Repeat for all 6 phases

---

## 📚 DOCUMENT PURPOSES

### PROJECT_TODOS.md
**Authoritative execution checklist**

Contains:
- 6 phases of work
- Clear success criteria
- Canonical field definitions
- Execution rules

Read this to know WHAT to do and WHY.

### AMAZON_Q_MASTER_PROMPT.md
**Disciplined instruction set for Q**

Contains:
- Strict rules Q must follow
- Assumptions Q cannot change
- Output format requirements
- Instructions to ask instead of guess

Paste this into Q chat to activate execution mode.

### RULES_OF_ENGAGEMENT.md
**Scope and safety guardrails**

Contains:
- ✅ Allowed changes
- ❌ Forbidden changes
- Scope boundaries
- Red flags

Reference this to prevent Q from going out of scope.

### EXECUTION_FRAMEWORK.md
**How to use all three documents**

Contains:
- Workflow steps
- Example conversation
- Verification checklist
- Safety mechanisms

Read this to understand HOW to execute.

---

## 🎯 THE OBJECTIVE

**Fix the MIS Reports system so that:**
- ✅ All report APIs return HTTP 200 (no 404s)
- ✅ All data is accurate and DPD-based
- ✅ All calculations are correct
- ✅ Frontend displays all reports
- ✅ Core loan logic is untouched

**Scope:** MIS Reports only  
**Time:** ~2 hours  
**Risk:** Low (minimal, isolated changes)

---

## 🔴 THE PROBLEM

```
Frontend calls: GET /api/v1/reports/portfolio
Backend response: 404 Not Found
Result: All reports fail to load
```

**Root causes:**
1. Routes not registered
2. Wrong schema fields in queries
3. Wrong calculation logic (status-based instead of DPD-based)
4. Missing model exports
5. Installment model not standalone

---

## ✅ THE SOLUTION

**6 phases of disciplined execution:**

| Phase | Goal | Time |
|-------|------|------|
| 0 | Pre-flight (read-only) | 5 min |
| 1 | Routing & plumbing | 15 min |
| 2 | Schema alignment | 20 min |
| 3 | Logic fixes | 30 min |
| 4 | Data model completion | 20 min |
| 5 | Defensive engineering | 15 min |
| 6 | Verification | 10 min |
| **Total** | | **115 min** |

---

## 🚦 EXECUTION WORKFLOW

### Before You Start
1. ✅ Read PROJECT_TODOS.md
2. ✅ Read RULES_OF_ENGAGEMENT.md
3. ✅ Understand the 6 phases
4. ✅ Know what's allowed/forbidden

### During Execution
1. Open Amazon Q chat
2. Paste AMAZON_Q_MASTER_PROMPT.md
3. Say: "Let's start with PHASE 0"
4. Q confirms canonical fields
5. You verify Q's understanding
6. Q proposes changes for PHASE 1
7. You review against RULES_OF_ENGAGEMENT.md
8. You approve or ask Q to revise
9. Q implements changes
10. Q summarizes and asks for next phase
11. Repeat for all 6 phases

### After Execution
1. ✅ All 6 phases complete
2. ✅ All endpoints return 200 OK
3. ✅ All data is accurate
4. ✅ Frontend displays reports
5. ✅ No core logic changed

---

## 💬 EXAMPLE: PHASE 1

### You:
```
Let's start PHASE 1 — ROUTING & PLUMBING.
```

### Q:
```
PHASE 1 — ROUTING & PLUMBING

Task 1: Register routes in app.js

File: backend/src/app.js
Add after line 50:

+ const reportsRoutes = require('./routes/reports.routes');
+ app.use('/api/v1/reports', protect, authorize('admin', 'manager'), reportsRoutes);

Reason: Frontend calls /api/v1/reports/* but routes not registered.

Verification: GET /api/v1/reports/portfolio returns 200.

Ready to implement?
```

### You:
```
Yes, implement.
```

### Q:
```
✓ Implemented.

Task 2: Register routes in app-production.js
[Similar...]

Ready to implement?
```

### You:
```
Yes, implement.
```

### Q:
```
✓ PHASE 1 complete.

Summary:
- Registered routes in app.js
- Registered routes in app-production.js
- All endpoints now return HTTP 200

Success criteria met ✓

Ready for PHASE 2?
```

### You:
```
Yes, proceed to PHASE 2.
```

---

## ✋ SAFETY MECHANISMS

### Q Will NOT:
- ❌ Modify core loan logic
- ❌ Change payment processing
- ❌ Modify auth/permissions
- ❌ Rename database fields
- ❌ Add new features
- ❌ Go out of scope

### Q WILL:
- ✅ Ask before proceeding to next phase
- ✅ Ask if information is missing
- ✅ Explain why each change is needed
- ✅ Stop if something is forbidden
- ✅ Work phase by phase in order

### You MUST:
- ✅ Review each change against RULES_OF_ENGAGEMENT.md
- ✅ Verify success criteria before approving next phase
- ✅ Stop Q if it goes out of scope
- ✅ Reference documents if Q hallucinates

---

## 🛑 RED FLAGS

Stop immediately if Q proposes:

1. **Modifying loan calculation logic**
   - EMI formulas
   - Interest calculations
   - Principal allocation

2. **Changing payment flow**
   - Payment allocation
   - Payment reconciliation
   - Payment status

3. **Modifying auth/permissions**
   - User roles
   - Access control
   - Token handling

4. **Renaming database fields**
   - This breaks existing code
   - This requires migration
   - This is out of scope

5. **Adding new features**
   - New report types
   - New endpoints
   - New models

**If you see a red flag, say: "STOP. This is forbidden. See RULES_OF_ENGAGEMENT.md."**

---

## 📋 VERIFICATION CHECKLIST

### After Each Phase
- [ ] Q summarized changes clearly
- [ ] All changes are in ALLOWED list
- [ ] No changes are in FORBIDDEN list
- [ ] Changes are within MIS Reports scope
- [ ] Success criteria from PROJECT_TODOS met
- [ ] No red flags encountered
- [ ] You approved before moving to next phase

### After All 6 Phases
- [ ] All report endpoints return 200 OK
- [ ] All endpoints return valid JSON
- [ ] Bucket totals = portfolio outstanding
- [ ] Efficiency ≤ 100%
- [ ] Aging totals ≤ portfolio
- [ ] Frontend displays all data
- [ ] No console errors
- [ ] No 404s

---

## 🎓 KEY PRINCIPLES

1. **Deterministic** - Everything is explicit, no guessing
2. **Phased** - Work in order, stop between phases
3. **Scoped** - MIS Reports only, nothing else
4. **Safe** - Allowed/forbidden lists prevent mistakes
5. **Verifiable** - Success criteria are measurable
6. **Reversible** - Changes are minimal and isolated

---

## 📞 REFERENCE QUICK LINKS

| Need | Document |
|------|----------|
| Know what to do | PROJECT_TODOS.md |
| Instruct Q | AMAZON_Q_MASTER_PROMPT.md |
| Check if allowed | RULES_OF_ENGAGEMENT.md |
| Understand workflow | EXECUTION_FRAMEWORK.md |
| Quick reference | This document |

---

## 🚀 READY TO START?

### Step 1: Read PROJECT_TODOS.md
Understand the 6 phases and what needs to be done.

### Step 2: Read RULES_OF_ENGAGEMENT.md
Know what's allowed and what's forbidden.

### Step 3: Open Amazon Q Chat
Paste AMAZON_Q_MASTER_PROMPT.md and wait for acknowledgment.

### Step 4: Say This:
```
I'm fixing the MIS Reports system using the execution framework.

Here's my master prompt:

[Paste AMAZON_Q_MASTER_PROMPT.md]

Let's start with PHASE 0 — PRE-FLIGHT from PROJECT_TODOS.md.
```

### Step 5: Follow the Phases
Work through all 6 phases, reviewing each change against RULES_OF_ENGAGEMENT.md.

### Step 6: Verify Success
Check that all endpoints return 200 OK and frontend displays data.

---

## ✨ SUMMARY

You now have:
- ✅ Clear objective (fix MIS Reports)
- ✅ Explicit phases (6 phases in order)
- ✅ Safety guardrails (allowed/forbidden lists)
- ✅ Disciplined Q (master prompt)
- ✅ Verification checklist (success criteria)

**Everything you need to fix MIS Reports in ~2 hours with minimal risk.**

---

**Generated:** 2024-01-15  
**Project:** Loan Management System (NBFC)  
**Scope:** MIS Reports System  
**Status:** Ready for execution ✅


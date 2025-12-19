# EXECUTION_FRAMEWORK.md

**How to use PROJECT_TODOS, AMAZON_Q_MASTER_PROMPT, and RULES_OF_ENGAGEMENT**

---

## 📚 The Three Documents

### 1. PROJECT_TODOS.md
**What to do, in what order, and why**

- 6 phases of work
- Clear success criteria for each phase
- Canonical field definitions
- Execution rules

**Use this to:** Know exactly what needs to be done and in what order.

### 2. AMAZON_Q_MASTER_PROMPT.md
**How to instruct Q to behave**

- Strict rules for Q
- Assumptions Q must not change
- Output format requirements
- Instructions to ask instead of guess

**Use this to:** Paste into Amazon Q chat to activate disciplined execution mode.

### 3. RULES_OF_ENGAGEMENT.md
**What Q is allowed vs forbidden to change**

- ✅ Allowed changes (routing, aggregations, calculations, models, error handling)
- ❌ Forbidden changes (core logic, payments, auth, schema, frontend, features)
- Scope boundaries (MIS Reports only)
- Red flags to stop immediately

**Use this to:** Prevent Q from hallucinating or going out of scope.

---

## 🚀 WORKFLOW

### Step 1: Prepare
1. Read `PROJECT_TODOS.md` completely
2. Read `RULES_OF_ENGAGEMENT.md` completely
3. Understand the 6 phases and what's allowed/forbidden

### Step 2: Start Amazon Q Session
1. Open Amazon Q chat
2. Paste the entire `AMAZON_Q_MASTER_PROMPT.md` into chat
3. Wait for Q to acknowledge

### Step 3: Execute Phase by Phase
1. Ask Q: "Let's start with PHASE 0 — PRE-FLIGHT"
2. Q confirms canonical fields
3. You verify Q's understanding
4. Q moves to PHASE 1 only after your confirmation

### Step 4: Review Each Change
1. Q proposes changes
2. You review against `RULES_OF_ENGAGEMENT.md`
3. You verify it's in ALLOWED list
4. You verify it's NOT in FORBIDDEN list
5. You approve or ask Q to revise

### Step 5: Verify After Each Phase
1. Q summarizes changes
2. You run verification checklist
3. You confirm success criteria met
4. You approve moving to next phase

### Step 6: Complete All 6 Phases
1. PHASE 0: Pre-flight (read-only)
2. PHASE 1: Routing & plumbing
3. PHASE 2: Schema alignment
4. PHASE 3: Logic fixes
5. PHASE 4: Data model completion
6. PHASE 5: Defensive engineering
7. PHASE 6: Verification

---

## 💬 EXAMPLE CONVERSATION

### You:
```
I'm fixing the MIS Reports system. Here's my master prompt:

[Paste AMAZON_Q_MASTER_PROMPT.md]

Let's start with PHASE 0 — PRE-FLIGHT from PROJECT_TODOS.md.
```

### Q:
```
I understand. I'm in disciplined execution mode for MIS Reports only.

PHASE 0 — PRE-FLIGHT (READ ONLY)

Canonical fields to confirm:
- Principal field = principal ✓
- Outstanding field = outstandingAmount ✓
- Disbursement date field = disbursementDate ✓
- DPD field = dpd ✓

Models to confirm:
- Loan ✓
- Installment (to be standalone) ✓
- Payment ✓
- LegalCase ✓
- User / Collector ✓

Ready to proceed to PHASE 1 when you confirm.
```

### You:
```
All confirmed. Proceed to PHASE 1 — ROUTING & PLUMBING.
```

### Q:
```
PHASE 1 — ROUTING & PLUMBING

Task 1: Register /api/v1/reports routes in app.js

File: backend/src/app.js
Location: After line 50 (after dashboard routes)

Change:
+ const reportsRoutes = require('./routes/reports.routes');
+ app.use('/api/v1/reports', protect, authorize('admin', 'manager'), reportsRoutes);

Reason: Frontend calls /api/v1/reports/* but routes not registered, causing 404s.

Verification: Backend starts, GET /api/v1/reports/portfolio returns 200 (even if empty).

Ready to implement?
```

### You:
```
Yes, implement this change.
```

### Q:
```
✓ Change implemented.

Task 2: Register /api/v1/reports routes in app-production.js

[Similar format...]

Ready to implement?
```

### You:
```
Yes, implement.
```

### Q:
```
✓ All PHASE 1 tasks complete.

Summary:
- Registered routes in app.js
- Registered routes in app-production.js
- All endpoints now return HTTP 200

Success criteria met: No 404s from frontend ✓

Ready for PHASE 2 — SCHEMA ALIGNMENT?
```

### You:
```
Yes, proceed to PHASE 2.
```

---

## ✅ VERIFICATION CHECKLIST

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

## 🛡️ SAFETY MECHANISMS

### Built into AMAZON_Q_MASTER_PROMPT.md
1. **Strict rules** - Q must follow them
2. **Assumptions** - Q cannot change them
3. **Phase-based** - Q must work in order
4. **Stop points** - Q must ask before proceeding
5. **Output format** - Q must explain changes

### Built into RULES_OF_ENGAGEMENT.md
1. **Allowed list** - Q can only do these
2. **Forbidden list** - Q cannot do these
3. **Scope boundaries** - MIS Reports only
4. **Red flags** - Q must stop immediately
5. **Enforcement** - Q must check before changing

### Built into PROJECT_TODOS.md
1. **Clear phases** - No ambiguity
2. **Success criteria** - Measurable outcomes
3. **Canonical fields** - No guessing
4. **Execution rules** - No shortcuts

---

## 🚨 IF SOMETHING GOES WRONG

### Q Hallucinates
**Solution:** Paste AMAZON_Q_MASTER_PROMPT.md again and say "Reset to master prompt."

### Q Goes Out of Scope
**Solution:** Reference RULES_OF_ENGAGEMENT.md and say "This is forbidden. See RULES_OF_ENGAGEMENT.md."

### Q Skips a Phase
**Solution:** Say "We must complete PHASE X first. See PROJECT_TODOS.md."

### Q Proposes Risky Change
**Solution:** Say "This is a red flag. See RULES_OF_ENGAGEMENT.md. Do not proceed."

### Q Asks for Clarification
**Solution:** This is GOOD. Q is following the master prompt rule: "Ask instead of guessing."

---

## 📊 EXPECTED TIMELINE

| Phase | Time | Status |
|-------|------|--------|
| PHASE 0 | 5 min | Read-only |
| PHASE 1 | 15 min | Routing |
| PHASE 2 | 20 min | Schema |
| PHASE 3 | 30 min | Logic |
| PHASE 4 | 20 min | Models |
| PHASE 5 | 15 min | Error handling |
| PHASE 6 | 10 min | Verification |
| **Total** | **115 min** | ~2 hours |

---

## 🎯 SUCCESS CRITERIA

### System Level
- ✅ All 6 report endpoints return 200 OK
- ✅ All endpoints return valid JSON
- ✅ No 404s from frontend
- ✅ Frontend displays all report data

### Data Level
- ✅ Bucket totals = portfolio outstanding
- ✅ Efficiency ≤ 100%
- ✅ Aging totals ≤ portfolio
- ✅ All calculations are correct

### Code Level
- ✅ No changes to core loan logic
- ✅ No changes to payment processing
- ✅ No changes to auth/permissions
- ✅ No database schema changes

### Process Level
- ✅ All phases completed in order
- ✅ All changes reviewed and approved
- ✅ All red flags avoided
- ✅ All verification checks passed

---

## 📞 REFERENCE

**When you need to:**

- **Know what to do** → Read `PROJECT_TODOS.md`
- **Instruct Q** → Paste `AMAZON_Q_MASTER_PROMPT.md`
- **Check if allowed** → Read `RULES_OF_ENGAGEMENT.md`
- **Understand workflow** → Read this document

---

## 🎓 KEY PRINCIPLES

1. **Deterministic** - No guessing, everything is explicit
2. **Phased** - Work in order, stop between phases
3. **Scoped** - MIS Reports only, nothing else
4. **Safe** - Allowed/forbidden lists prevent mistakes
5. **Verifiable** - Success criteria are measurable
6. **Reversible** - Changes are minimal and isolated

---

**This framework turns a fuzzy "fix MIS" task into a deterministic execution program.**


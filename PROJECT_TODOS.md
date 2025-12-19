# PROJECT_TODOS.md

**Authoritative execution checklist for MIS Reports system**

## 🎯 Objective

Fix the MIS Reports system so that all report APIs return accurate, DPD-based, date-driven data with correct schemas and zero 404s.

**Scope is MIS only. Core loan lifecycle must not be altered.**

---

## 🧱 PHASE 0 — PRE-FLIGHT (READ ONLY)

**Goal:** Prevent wrong assumptions

### Identify canonical fields:
- Principal field = `principal`
- Outstanding field = `outstandingAmount`
- Disbursement date field = `disbursementDate`
- DPD field = `dpd`

### Confirm current models:
- Loan
- Installment (to be standalone)
- Payment
- LegalCase
- User / Collector

**❌ No code changes in this phase.**

---

## 🔌 PHASE 1 — ROUTING & PLUMBING (BLOCKING)

**Goal:** Remove 404s, enable API reachability

### Tasks:
1. Register `/api/v1/reports` routes in:
   - `backend/src/app.js`
   - `backend/src/app-production.js`

2. Verify all endpoints return HTTP 200 (even with empty data):
   - `/portfolio`
   - `/buckets`
   - `/aging`
   - `/efficiency`
   - `/legal`
   - `/collectors`

**✅ Success condition:** No 404s from frontend.

---

## 🧠 PHASE 2 — SCHEMA ALIGNMENT (DATA CORRECTNESS)

**Goal:** Queries must match real fields

### Tasks:
1. Replace incorrect field references:
   - `loanAmount` → `principal`
   - status-based bucket logic → DPD-based
   - status-based aging → date-based

2. Update all Mongo aggregations to use:
   - `principal`
   - `outstandingAmount`
   - `dpd`
   - `disbursementDate`

**⚠️ Do NOT rename DB fields. Only update queries.**

---

## 📊 PHASE 3 — LOGIC FIXES (CORE MIS)

**Goal:** MIS reflects reality, not labels

### Bucket calculation:
- **Current** = DPD ≤ 0
- **X** = DPD 1–7
- **Y** = DPD 8–30
- **M1** = DPD 31–60
- **M2** = DPD 61–90
- **M3** = DPD 91–180
- **NPA** = DPD > 180

### Aging analysis:
- Calculated using date difference from `disbursementDate`
- Periods: 0-30, 31-60, 61-90, 90+

### Collection efficiency:
- Efficiency = (Collected / Due) × 100
- Same time window for both

**📌 No status strings allowed in calculations.**

---

## 🧩 PHASE 4 — DATA MODEL COMPLETION

**Goal:** Enable scalable aggregations

### Tasks:
1. Create standalone Installment model
2. Link installments to loans via `loanId`
3. Export model from `models/index.js`
4. Update MIS aggregations to read from Installments

---

## 🛡️ PHASE 5 — DEFENSIVE ENGINEERING

**Goal:** Stability & debuggability

### Tasks:
1. Add structured error handling for all report controllers
2. Add input validation for date ranges
3. Ensure empty datasets return valid JSON (not null)

---

## 🧪 PHASE 6 — VERIFICATION

**Goal:** Proof, not hope

### Verification checklist:
- [ ] All report endpoints return non-null JSON
- [ ] Bucket totals = portfolio outstanding
- [ ] Efficiency ≤ 100%
- [ ] Aging totals ≤ portfolio
- [ ] Frontend dashboards render data correctly
- [ ] No console errors
- [ ] No 404s

---

## 📋 Execution Rules

1. **Work PHASE BY PHASE in order**
2. **After each phase, STOP and summarize changes**
3. **Ask for confirmation before moving to next phase**
4. **Do NOT skip phases**
5. **Do NOT modify unrelated code**
6. **Do NOT invent new fields or business logic**


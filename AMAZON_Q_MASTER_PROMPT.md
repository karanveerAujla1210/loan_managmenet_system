# AMAZON_Q_MASTER_PROMPT.md

**Paste this into Amazon Q Chat once per session**

---

You are Amazon Q working on a Node.js + MongoDB Loan Management System.

Your task is to implement ONLY the TODOs defined in `PROJECT_TODOS.md`.

## STRICT RULES

1. **Do NOT invent new fields, schemas, or business logic.**
2. **Do NOT refactor unrelated files.**
3. **Do NOT modify core loan lifecycle, payment flow, or auth.**
4. **Do NOT rename database fields.**
5. **Work PHASE BY PHASE in order.**
6. **After completing each phase, STOP and summarize changes.**
7. **Ask for confirmation before moving to the next phase.**

## ASSUMPTIONS (DO NOT CHANGE)

- Principal field = `principal`
- DPD is the source of truth for delinquency
- Aging is date-based, not status-based
- Installments must be a standalone model
- Bucket assignment is DPD-based, not status-based

## OUTPUT FORMAT

For each change, provide:
- Files modified
- Code added/changed (diff-style)
- Reason for change
- Verification step

## IF INFORMATION IS MISSING

**ASK instead of guessing.**

Do not make assumptions about:
- Field names
- Data types
- Calculation logic
- Model relationships

---

## CURRENT CONTEXT

**Project:** Loan Management System (NBFC)  
**Scope:** MIS Reports System  
**Status:** Broken (404s, wrong calculations)  
**Objective:** Fix all report APIs to return accurate data

**Reference Documents:**
- `PROJECT_TODOS.md` - Execution checklist
- `PROJECT_REVIEW_SUMMARY.md` - System analysis
- `QUICK_REFERENCE.md` - Schema reference

---

## START HERE

Begin with **PHASE 0 — PRE-FLIGHT** from `PROJECT_TODOS.md`.

Confirm all canonical fields before proceeding to PHASE 1.


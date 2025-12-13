# Frontend UI/UX Specification — Loan Management CRM

This document defines the high-level UI/UX requirements, core pages, component inventory, accessibility and security notes for the `frontend-web` application. It's intentionally pragmatic so engineers can implement reliably and reviewers can validate behavior.

---

## Goals
- Provide a clean, responsive CRM focused on loan lifecycle and collections workflows.
- Prioritize clarity for financial users: readable numbers, clear status badges, and safe actions (confirmations, audit traces).
- Use Tailwind CSS + existing component primitives; centralize data fetching with `react-query` and `axios`.
- Graceful degradation: mock service fallbacks available when backend is offline.

---

## Core Pages (must-have)
- Dashboard: high-level KPIs (total active loans, disbursed this month, overdue amount, collections today), recent activity, quick actions.
- Customers: paginated searchable list, filters (status, branch), `Customer detail` page with profile, loans, payments, documents.
- Loans: list and KPIs (applications, pending, disbursed, active), ability to view loan details, approve/reject, disburse, and edit loan metadata.
- Collections / Payments: list of due payments, filters (status, collector, date range), record payment flow (modal), reconciliation status.
- Disbursements: manage pending disbursements, exportable batch operations, per-branch views.
- Reports: generate/export reports (portfolio, DPD aging, payments, disbursements), with date range and grouping options.
- Auth & Profile: login, register (if enabled), forgot/reset password, profile settings, change password.
- Admin: user management (roles, permissions), system settings, audit logs (who approved/disbursed/edited).
- Upload / Data import: data import page with validation preview and bulk import status.

---

## Important Flows
- Login → Dashboard → Quick view of overdue & due payments.
- Customer lookup → View customer → View loan → Record payment / View schedule.
- Loan approval: manager clicks Approve → confirm modal → backend call → update list/metrics.
- Collections: collector records payment (amount, method, txn id) → system marks payment and updates loan schedule.

---

## Component Inventory
(Organize components as primitives → composed components → page-level compositions.)

Primitives:
- Button (variants: primary, outline, ghost, danger, icon-only)
- Input (text, number, email, password)
- Select / Multi-select
- Textarea
- Checkbox / Radio
- Switch / Toggle
- Badge / Status pill
- Modal / Dialog
- Tooltip
- Icon (using `lucide-react`)
- Table primitive (with sortable headers)
- Pagination control
- Spinner / Loading indicator
- Avatar / Initials
- Datepicker (or use native `<input type="date">` for simple flows)

Composed components:
- Page `Layout` (Sidebar + Header + Content)
- `Header` (search, user menu, notifications)
- `Sidebar` (navigation groups: Dashboard, Customers, Loans, Collections, Reports, Admin)
- `DataTable` (wraps table primitive, supports sorting, column config, row actions)
- `FilterBar` (search, status, branch, date range, page size)
- `EntityCard` (summary card used on dashboard for KPIs)
- `RecordPaymentModal` (form: amount, method, txn id, collector)
- `CustomerForm` / `LoanForm` (create/edit forms using react-hook-form or Formik)
- `ConfirmDialog` (delete/approve/reject confirmations)
- `FileUploader` (drag & drop with preview)

Page compositions:
- `CustomersPage` = `FilterBar` + `DataTable` + `Pagination` + `AddCustomer` modal
- `CustomerDetail` = profile panel + loans list + payments list + notes/documents
- `LoansPage` = KPI cards + `FilterBar` + `DataTable` + `CreateLoan` modal
- `CollectionsPage` = KPI cards + `FilterBar` + `DataTable` + `RecordPaymentModal`

---

## UI Rules & Patterns
- Layout: sidebar left (collapsed on small screens), header top for utilities. Use container widths to keep content readable on large screens.
- Typography: use system font stack; for numeric-heavy UI use clear font weights and tabular numbers where possible.
- Colors: positive (green) for collected/approved, neutral (gray) for closed, warning (yellow/orange) for pending, danger (red) for overdue/rejected.
- Numbers: show currency with grouping separators; display amounts with two decimal places when needed. Use abbreviations for large numbers (k/M) only in KPI cards; full numbers in tables.
- Confirm destructive actions (delete, reject) with a typed-confirm for critical operations.
- Provide undo where feasible for non-critical actions (e.g., soft-delete for records).

---

## Accessibility (A11y)
- All interactive elements keyboard focusable and reachable (tab order predictable).
- Ensure color contrast >= WCAG AA for text and UI controls.
- Provide aria-labels for icon-only buttons, aria-live for toast notifications.
- Forms should expose inline validation messages and aria-invalid attributes.
- Use semantic HTML for tables and headings to aid screen readers.

---

## Security & Data Handling Notes
- Store tokens in secure, HttpOnly cookies when possible. If using localStorage for a mock/dev flow, document this clearly and keep tokens short-lived.
- Protect against XSS: sanitize any HTML (use `dompurify` where necessary for server-provided HTML).
- CSRF: backend should issue CSRF tokens or set SameSite cookies; frontend should respect backend guidance and send credentials when `withCredentials` required.
- Rate-limit critical operations in UI (disable buttons while request in flight); display clear errors returned from backend.
- Mask sensitive PII in logs and UI exports unless explicitly requested.

---

## Data fetching & caching
- Centralize API client in `src/services/api.js`. Use `react-query` for caching/fetching with sensible staleTime and retry rules.
- Use optimistic updates for small actions (e.g., marking a payment) only when backend supports idempotency.
- Provide clear loading and error UX for each network state.

---

## Testing & QA
- Unit tests for services and critical UI components (DataTable, FilterBar, auth flows).
- Integration tests for flows: login → dashboard, customer search → view detail, record payment flow.
- Add E2E tests later if desired (Cypress/Playwright).

---

## Deliverables from this phase
- `UI_SPEC.md` (this file) stored in `frontend-web/` (done).
- Component inventory (section above) — begin implementing core primitives and reuse them across pages.
- Low-fidelity wireframes (next step) — can be simple PNG/SVG sketched or ascii flow; reserve as a separate artifact.

---

## Next immediate tasks
1. Build `Layout`, `Header`, `Sidebar`, `DataTable`, `Pagination`, and `FilterBar` primitives.
2. Implement Customers page (done), then Loans and Collections using same primitives.
3. Add form validation rules and modal patterns for record/create actions.
4. Add basic unit tests for services and `DataTable`.


---

File created by: GitHub Copilot (interactive assistant) — edit as needed.

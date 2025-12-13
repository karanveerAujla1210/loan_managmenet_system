# Low-fidelity Wireframes — Loan Management CRM

This file contains quick, low-fi wireframes and page flows for the main screens. Use these as implementation guidance for layout and component placement.

---

1) Dashboard (desktop)

+-----------------------------------------------------------+
| Sidebar | Header (search / notifications / profile)        |
|         +-----------------------------------------+-------|
|         | KPI Cards (row)                          | user  |
|         | - Active Loans      1,234                 | icon  |
|         | - Disbursed MTD     ₹12,345,678           |       |
|         | - Overdue Amount    ₹123,456              |       |
|         | - Collections Today ₹45,678               |       |
|         +-----------------------------------------+-------|
|         | Recent Activity / Alerts (list)                |
|         | Top delinquencies (table)                      |
|         | Quick Actions: Create Loan | Record Payment     |
+-----------------------------------------------------------+

Notes: KPI cards are horizontally scrollable on small screens. Use `EntityCard` primitive.

2) Customers list (desktop)

+-----------------------------------------------------------+
| Sidebar | Header                                           |
|         +-------------------------------------------------|
|         | FilterBar: [search] [status select] [Show 10 v]  |
|         | [Add Customer]                                   |
|         +-------------------------------------------------|
|         | Table: (columns) Customer | Contact | Status | ...|
|         | Rows: click → Customer Detail                     |
|         +-------------------------------------------------|
|         | Pagination (Prev / Page 2 / Next)                |
+-----------------------------------------------------------+

3) Customer detail (desktop)

+-----------------------------------------------------------+
| Sidebar | Header                                           |
|         +-------------------------------------------------|
|         | [Back] Customer name (title)  [Edit] [More]     |
|         | ------------------------------------------------|
|         | Left column: profile card (contact, docs, tags) |
|         | Right column: Tabs: Loans | Payments | Notes     |
|         | Loans: list with amount/status → click to Loan  |
|         | Payments: list, Record Payment button           |
+-----------------------------------------------------------+

4) Loans list

+-----------------------------------------------------------+
| Sidebar | Header                                           |
|         +-------------------------------------------------|
|         | KPI Cards (Total apps / Pending / Disbursed MTD) |
|         | FilterBar: [search] [status] [show 10 v]         |
|         | Table: Loan ID | Customer | Amount | Status | Actions |
|         | Actions: Approve / Reject / Edit / Disburse       |
|         +-------------------------------------------------|
|         | Pagination                                       |
+-----------------------------------------------------------+

5) Collections (Payments)

+-----------------------------------------------------------+
| Sidebar | Header                                           |
|         +-------------------------------------------------|
|         | KPI Cards: Due Today | Overdue | Collected MTD    |
|         | FilterBar: [search] [status] [collector] [show v] |
|         | Table: Customer | Amount | Due Date | Status | Actions|
|         | Actions: View | Edit | Mark Collected (confirm)     |
|         +-------------------------------------------------|
|         | Pagination                                       |
+-----------------------------------------------------------+

6) Record Payment modal (flow)

- Trigger: Collections → Record Payment (button or row action)
- Modal fields:
  - Loan ID (search/select)
  - Customer (autofill)
  - Amount (required, numeric)
  - Payment Method (select) + transaction/reference id
  - Date (default today)
  - Collector (user) optional
  - Notes (optional, sanitized)
- Buttons: Cancel | Save (disabled while submitting)
- On success: show toast, close modal, invalidate collections/loans queries.

7) Auth flows (compact)

- Login page (email, password) → on success redirect to Dashboard.
- Forgot password → email → reset link → Reset page.
- Profile → Update details / Change password.

---

Page flow examples (simplified):

Login → Dashboard
Dashboard → Customers → Customer Detail → Loan Detail
Dashboard → Loans → Click pending loan → Approve (confirm) → refresh KPIs
Collections → Record Payment modal → Submit → toast + refresh

---

Responsive notes
- Sidebar collapses to hamburger on small screens, content becomes single-column.
- FilterBar stacks vertically on narrow screens.
- Tables allow horizontal scroll; consider summary cards for mobile.

Accessibility notes
- Provide `aria-labels` for icon-only buttons.
- Ensure keyboard focus order: header → filter → table → pagination.
- Confirm modals trap focus and restore on close.

---

File created by assistant — use as implementation guide and iterate with design stakeholders.

/**
 * MongoDB Schema Setup & Indexes
 * Run this after models are created to ensure all indexes exist
 */

// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ active: 1 });

// Loan Products
db.loanproducts.createIndex({ productCode: 1 }, { unique: true });
db.loanproducts.createIndex({ active: 1 });

// Loans
db.loans.createIndex({ assignedTo: 1, status: 1 });
db.loans.createIndex({ status: 1 });
db.loans.createIndex({ disbursementDate: 1 });
db.loans.createIndex({ phone: 1 });

// Instalments
db.instalments.createIndex({ loanId: 1, instalmentNo: 1 }, { unique: true });
db.instalments.createIndex({ dueDate: 1, status: 1 });
db.instalments.createIndex({ loanId: 1, status: 1 });

// Payments
db.payments.createIndex({ paymentDate: 1 });
db.payments.createIndex({ loanId: 1 });
db.payments.createIndex({ reference: 1 }, { sparse: true });
db.payments.createIndex({ createdAt: 1 });

// FollowUps
db.followups.createIndex({ loanId: 1 });
db.followups.createIndex({ nextFollowUpDate: 1 });

/**
 * CRITICAL RULES:
 * 
 * 1. Loans are immutable after creation:
 *    - loanAmount
 *    - productId
 *    - disbursementDate
 * 
 * 2. Instalments are generated once and never deleted
 * 
 * 3. Payments are append-only (no updates/deletes)
 *    - Corrections = new payment row
 * 
 * 4. Only CONTROLLER can reassign loans (assignedTo)
 * 
 * 5. Collectors query by assignedTo + status
 * 
 * 6. DPD & Bucket are computed, not stored
 */

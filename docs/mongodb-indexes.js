// MongoDB Indexes for Production Scale

// Loans
db.loans.createIndex({ loanId: 1 }, { unique: true });
db.loans.createIndex({ status: 1, bucket: 1 });
db.loans.createIndex({ dpd: 1 });
db.loans.createIndex({ customerId: 1 });
db.loans.createIndex({ branch: 1 });

// Installments
db.installments.createIndex({ loanId: 1, installmentNo: 1 }, { unique: true });
db.installments.createIndex({ loanId: 1, status: 1 });
db.installments.createIndex({ dueDate: 1 });

// Payments
db.payments.createIndex({ loanId: 1 });
db.payments.createIndex({ utr: 1 }, { sparse: true, unique: true });
db.payments.createIndex({ reconciled: 1 });
db.payments.createIndex({ createdAt: 1 });

// Customers
db.customers.createIndex({ phone: 1 }, { unique: true });
db.customers.createIndex({ email: 1 }, { sparse: true });

// Legal Cases
db.legalcases.createIndex({ loanId: 1 }, { unique: true });
db.legalcases.createIndex({ status: 1 });

// Loan Bucket History
db.loanbuckethistories.createIndex({ loanId: 1 });
db.loanbuckethistories.createIndex({ changedAt: 1 });

// Disputes
db.disputes.createIndex({ loanId: 1 });
db.disputes.createIndex({ status: 1 });

// Collector Performance
db.collectorperformances.createIndex({ collectorId: 1, 'week.startDate': 1 });

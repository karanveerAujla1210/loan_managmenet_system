const User = require('./user.model');
const Loan = require('./loan.model');
const Installment = require('./installment.model');
const Payment = require('./payment.model');
const Customer = require('./customer.model');
const AuditLog = require('./audit-log.model');
const Dispute = require('./dispute.model');
const CollectorPerformance = require('./collector-performance.model');
const BankReconciliation = require('./bank-reconciliation.model');
const LoanBucketHistory = require('./loan-bucket-history.model');
const PromiseToPay = require('./promise-to-pay.model');
const LegalCase = require('./legal-case.model');

module.exports = {
  User,
  Loan,
  Installment,
  Payment,
  Customer,
  AuditLog,
  Dispute,
  CollectorPerformance,
  BankReconciliation,
  LoanBucketHistory,
  PromiseToPay,
  LegalCase
};

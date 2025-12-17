// Re-export models from src for backward compatibility with old routes
module.exports = {
  User: require('../src/models/User'),
  Loan: require('../src/models/Loan'),
  Payment: require('../src/models/Payment'),
  Instalment: require('../src/models/Instalment'),
  LoanProduct: require('../src/models/LoanProduct'),
  FollowUp: require('../src/models/FollowUp'),
  Customer: require('../src/models/customer.model'),
  LegalCase: require('../src/models/LegalCase'),
  LoanBucketHistory: require('../src/models/LoanBucketHistory'),
  AuditLog: require('../src/models/audit-log.model'),
  Dispute: require('../src/models/Dispute'),
  PromiseToPay: require('../src/models/promise-to-pay.model')
};

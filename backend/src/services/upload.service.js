const Payment = require('../models/payment.model');
const Disbursement = require('../models/disbursement.model');
const Loan = require('../models/loan.model');

class UploadService {
  static async processDisbursementData(data) {
    const results = { success: 0, failed: 0, errors: [] };

    for (const record of data) {
      try {
        if (!record.loanId || !record.amount || !record.method) {
          results.failed++;
          results.errors.push({
            record,
            error: 'Missing required fields: loanId, amount, method'
          });
          continue;
        }

        const loan = await Loan.findOne({ loanId: record.loanId });
        if (!loan) {
          results.failed++;
          results.errors.push({
            record,
            error: `Loan not found: ${record.loanId}`
          });
          continue;
        }

        const disbursement = new Disbursement({
          loanId: loan._id,
          customerId: loan.customerId,
          amount: record.amount,
          method: record.method,
          status: record.status || 'pending',
          bankDetails: record.bankDetails || {},
          txnRef: record.txnRef,
          disbursedAt: record.disbursedAt ? new Date(record.disbursedAt) : null,
          metadata: record.metadata || {}
        });

        await disbursement.save();
        results.success++;

      } catch (error) {
        results.failed++;
        results.errors.push({ record, error: error.message });
      }
    }

    return results;
  }

  static async processPaymentData(data) {
    const results = { success: 0, failed: 0, errors: [] };

    for (const record of data) {
      try {
        if (!record.loanId || !record.amount || !record.method) {
          results.failed++;
          results.errors.push({
            record,
            error: 'Missing required fields: loanId, amount, method'
          });
          continue;
        }

        const loan = await Loan.findOne({ loanId: record.loanId });
        if (!loan) {
          results.failed++;
          results.errors.push({
            record,
            error: `Loan not found: ${record.loanId}`
          });
          continue;
        }

        const payment = new Payment({
          loanId: loan._id,
          customerId: loan.customerId,
          amount: record.amount,
          method: record.method,
          status: record.status || 'success',
          txnRef: record.txnRef,
          installmentSequence: record.installmentSequence,
          allocation: record.allocation || {},
          processedAt: record.processedAt ? new Date(record.processedAt) : new Date(),
          metadata: record.metadata || {}
        });

        await payment.save();
        results.success++;

      } catch (error) {
        results.failed++;
        results.errors.push({ record, error: error.message });
      }
    }

    return results;
  }
}

module.exports = UploadService;
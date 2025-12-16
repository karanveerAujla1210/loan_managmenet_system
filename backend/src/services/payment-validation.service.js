const Payment = require('../models/payment.model');
const moment = require('moment');

class PaymentValidationService {
  static async validateDuplicateUTR(utr) {
    if (!utr) return true;
    
    const existing = await Payment.findOne({ txnRef: utr, status: 'success' });
    if (existing) {
      throw new Error(`Duplicate UTR detected: ${utr}. Payment already processed.`);
    }
    return true;
  }

  static async validateBackdatedPayment(paymentDate) {
    const today = moment().startOf('day');
    const paymentDay = moment(paymentDate).startOf('day');
    
    if (paymentDay.isBefore(today)) {
      const daysBack = today.diff(paymentDay, 'days');
      if (daysBack > 7) {
        throw new Error(`Backdated payment (${daysBack} days). Requires manager approval.`);
      }
    }
    return true;
  }

  static async validatePaymentAmount(amount) {
    if (amount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    if (amount > 10000000) {
      throw new Error('Payment amount exceeds maximum limit');
    }
    return true;
  }

  static async validateLoanActive(loanId) {
    const Loan = require('../models/loan.model');
    const loan = await Loan.findById(loanId);
    
    if (!loan) throw new Error('Loan not found');
    if (loan.status === 'CLOSED') throw new Error('Cannot pay closed loan');
    if (loan.status === 'REJECTED') throw new Error('Cannot pay rejected loan');
    
    return true;
  }
}

module.exports = PaymentValidationService;

const Payment = require('../models/payment.model');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');

class LoanLinkingService {
  static async linkPaymentToLoan(paymentId, loanId) {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error('Payment not found');

    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    payment.loanId = loanId;
    await payment.save();

    return payment;
  }

  static async autoLinkPayments() {
    const unlinkedPayments = await Payment.find({ loanId: { $exists: false } });
    let linked = 0;

    for (const payment of unlinkedPayments) {
      const loan = await Loan.findOne({ customerId: payment.customerId });
      if (loan) {
        payment.loanId = loan._id;
        await payment.save();
        linked++;
      }
    }

    return { linked };
  }
}

module.exports = LoanLinkingService;

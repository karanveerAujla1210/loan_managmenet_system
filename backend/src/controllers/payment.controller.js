const Payment = require('../models/Payment');
const PaymentAllocatorService = require('../services/payment-allocator.service');
const AuditLog = require('../models/audit-log.model');

class PaymentController {
  static async recordManualPayment(req, res) {
    try {
      const { loanId, amount, paymentDate, mode, utr } = req.body;

      if (!loanId || !amount || !paymentDate || !mode) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const payment = await Payment.create({
        loanId,
        amount,
        method: mode,
        status: 'pending',
        txnRef: utr,
        createdAt: new Date(paymentDate)
      });

      if (PaymentAllocatorService?.allocatePayment) {
        const result = await PaymentAllocatorService.allocatePayment(payment._id, req.user?.id);
        return res.json({ success: true, data: result });
      }

      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getPaymentHistory(req, res) {
    try {
      const { loanId } = req.params;
      if (!loanId) {
        return res.status(400).json({ success: false, message: 'loanId required' });
      }
      const payments = await Payment.find({ loanId }).sort({ createdAt: -1 });
      res.json({ success: true, data: payments });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = PaymentController;

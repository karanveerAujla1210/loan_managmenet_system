const Payment = require('../models/payment.model');
const Installment = require('../models/installment.model');
const moment = require('moment');

class PaymentSafetyService {
  static async recordPaymentSafely(loanId, amount, paymentDate, mode, utr, userId) {
    // 1. Validate duplicate UTR
    if (utr) {
      const existing = await Payment.findOne({ txnRef: utr, status: 'success' });
      if (existing) throw new Error(`Duplicate UTR: ${utr}`);
    }

    // 2. Validate backdating
    const daysBack = moment().diff(moment(paymentDate), 'days');
    if (daysBack > 7) {
      throw new Error(`Backdated payment (${daysBack} days). Requires manager approval.`);
    }

    // 3. Validate amount
    if (amount <= 0 || amount > 10000000) {
      throw new Error('Invalid payment amount');
    }

    // 4. Create payment
    const payment = await Payment.create({
      loanId,
      amount,
      method: mode,
      status: 'pending',
      txnRef: utr,
      createdAt: new Date(paymentDate)
    });

    return payment;
  }

  static async allocatePaymentSafely(paymentId, userId) {
    const payment = await Payment.findById(paymentId).populate('loanId');
    if (!payment) throw new Error('Payment not found');

    const installments = await Installment.find({ loanId: payment.loanId._id })
      .sort({ installmentNo: 1 });

    let remaining = payment.amount;
    const allocations = [];

    for (const inst of installments) {
      if (remaining <= 0 || inst.status === 'PAID') continue;

      const isOverdue = moment().isAfter(moment(inst.dueDate));
      const penalty = isOverdue && inst.penalty === 0 ? 250 : 0;
      const due = inst.remainingAmount + penalty;
      const allocated = Math.min(remaining, due);

      inst.paidAmount += allocated;
      inst.remainingAmount = Math.max(0, inst.remainingAmount - allocated);
      inst.penalty = penalty;
      inst.status = allocated >= due ? 'PAID' : 'PARTIAL';
      if (inst.status === 'PAID') inst.paidDate = new Date();
      await inst.save();

      allocations.push({ installmentNo: inst.installmentNo, allocated, penalty });
      remaining -= allocated;
    }

    payment.status = 'success';
    payment.processedAt = new Date();
    payment.processedBy = userId;
    await payment.save();

    return { payment, allocations };
  }
}

module.exports = PaymentSafetyService;

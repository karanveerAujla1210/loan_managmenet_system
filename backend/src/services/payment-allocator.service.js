const Installment = require('../models/installment.model');
const Loan = require('../models/loan.model');
const Payment = require('../models/payment.model');
const AuditLog = require('../models/audit-log.model');
const moment = require('moment');

const PENALTY_AMOUNT = 250;

class PaymentAllocatorService {
  static async allocatePayment(paymentId, userId) {
    const payment = await Payment.findById(paymentId).populate('loanId');
    if (!payment) throw new Error('Payment not found');

    const loan = payment.loanId;
    const installments = await Installment.find({ loanId: loan._id }).sort({ installmentNo: 1 });

    let remainingAmount = payment.amount;
    const allocations = [];
    let penaltyCharged = 0;

    for (const inst of installments) {
      if (remainingAmount <= 0) break;
      if (inst.status === 'PAID') continue;

      const isOverdue = moment().isAfter(moment(inst.dueDate));
      let penalty = 0;

      if (isOverdue && inst.penalty === 0) {
        penalty = PENALTY_AMOUNT;
        penaltyCharged += penalty;
      }

      const totalDue = inst.remainingAmount + penalty;
      const allocated = Math.min(remainingAmount, totalDue);

      allocations.push({
        installmentId: inst._id,
        installmentNo: inst.installmentNo,
        allocated,
        penalty,
        newStatus: allocated >= totalDue ? 'PAID' : 'PARTIAL'
      });

      remainingAmount -= allocated;

      // Update installment
      inst.paidAmount += allocated;
      inst.remainingAmount = Math.max(0, inst.remainingAmount - allocated);
      inst.penalty = penalty;
      inst.status = allocations[allocations.length - 1].newStatus;
      if (inst.status === 'PAID') inst.paidDate = new Date();
      await inst.save();
    }

    // Update payment
    payment.allocation = {
      principal: allocations.reduce((sum, a) => sum + a.allocated, 0),
      penalty: penaltyCharged
    };
    payment.status = 'success';
    payment.processedAt = new Date();
    payment.processedBy = userId;
    await payment.save();

    // Update loan outstanding
    const updatedInstallments = await Installment.find({ loanId: loan._id });
    const outstanding = updatedInstallments.reduce((sum, inst) => sum + inst.remainingAmount, 0);
    loan.outstandingAmount = outstanding;
    await loan.save();

    // Audit log
    await AuditLog.create({
      action: 'PAYMENT_ALLOCATED',
      entity: 'PAYMENT',
      entityId: payment._id,
      userId,
      changes: { after: { allocations, penaltyCharged } },
      status: 'SUCCESS'
    });

    return { payment, allocations, penaltyCharged };
  }
}

module.exports = PaymentAllocatorService;

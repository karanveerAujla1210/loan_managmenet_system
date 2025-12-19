const Loan = require('../../models/loan.model');
const Installment = require('../../models/installment.model');
const Payment = require('../../models/payment.model');
const AuditLog = require('../../models/audit-log.model');
const { getError } = require('../../utils/errorCodes');

const recordPayment = async (req, res) => {
  try {
    const { loanId, amount, method, reference, idempotencyKey } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: getError('INVALID_AMOUNT')
      });
    }

    // Check idempotency
    if (idempotencyKey) {
      const existing = await Payment.findOne({ idempotencyKey });
      if (existing) return res.json({ success: true, data: existing });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: getError('LOAN_NOT_FOUND')
      });
    }

    // Find oldest unpaid installment
    const installment = await Installment.findOne({
      loanId,
      status: { $in: ['pending', 'partially_paid'] }
    }).sort({ sequence: 1 });

    if (!installment) {
      return res.status(409).json({
        success: false,
        error: getError('NO_PENDING_INSTALLMENT')
      });
    }

    // Create payment
    const payment = await Payment.create({
      loanId,
      amount,
      method,
      reference,
      status: 'confirmed',
      idempotencyKey,
      createdBy: req.user?.id
    });

    // Update installment
    installment.paidPrincipal = (installment.paidPrincipal || 0) + amount;
    if (installment.paidPrincipal >= installment.principalDue) {
      installment.status = 'paid';
    } else {
      installment.status = 'partially_paid';
    }
    await installment.save();

    // Update loan outstanding
    loan.outstandingAmount = Math.max(0, (loan.outstandingAmount || 0) - amount);
    await loan.save();

    // Audit
    await AuditLog.create({
      userId: req.user?.id,
      entityType: 'PAYMENT',
      entityId: payment._id,
      action: 'CREATE',
      after: payment.toObject(),
      timestamp: new Date()
    });

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const { loanId } = req.query;
    const payments = await Payment.find({ loanId }).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

module.exports = { recordPayment, getPayments };

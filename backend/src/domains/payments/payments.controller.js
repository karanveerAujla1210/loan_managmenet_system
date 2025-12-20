const Loan = require('../../models/loan.model');
const Installment = require('../../models/installment.model');
const Payment = require('../../models/payment.model');
const AuditLog = require('../../models/audit-log.model');
const { getError } = require('../../utils/errorCodes');

const validatePaymentInput = (amount, method) => {
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return { valid: false, error: getError('INVALID_AMOUNT') };
  }
  if (!method || !['cash', 'cheque', 'transfer', 'online'].includes(method)) {
    return { valid: false, error: getError('INVALID_METHOD') };
  }
  return { valid: true };
};

const recordPayment = async (req, res) => {
  try {
    const { loanId, amount, method, reference, idempotencyKey } = req.body;

    const validation = validatePaymentInput(amount, method);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    if (!loanId) {
      return res.status(400).json({ 
        success: false, 
        error: getError('VALIDATION_ERROR', { field: 'loanId' }) 
      });
    }

    if (idempotencyKey) {
      const existing = await Payment.findOne({ idempotencyKey });
      if (existing) {
        return res.json({ success: true, data: existing });
      }
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, error: getError('LOAN_NOT_FOUND') });
    }

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

    const payment = await Payment.create({
      loanId,
      amount,
      method,
      reference: reference || null,
      status: 'confirmed',
      idempotencyKey: idempotencyKey || null,
      createdBy: req.user?.id || null,
      createdAt: new Date()
    });

    installment.paidPrincipal = (installment.paidPrincipal || 0) + amount;
    if (installment.paidPrincipal >= installment.principalDue) {
      installment.status = 'paid';
    } else {
      installment.status = 'partially_paid';
    }
    await installment.save();

    loan.outstandingAmount = Math.max(0, (loan.outstandingAmount || 0) - amount);
    await loan.save();

    await AuditLog.create({
      userId: req.user?.id,
      entityType: 'PAYMENT',
      entityId: payment._id,
      action: 'CREATE',
      after: payment.toObject(),
      timestamp: new Date()
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const { loanId, limit = 20, skip = 0 } = req.query;

    if (!loanId) {
      return res.status(400).json({ 
        success: false, 
        error: getError('VALIDATION_ERROR', { field: 'loanId' }) 
      });
    }

    const payments = await Payment.find({ loanId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Payment.countDocuments({ loanId });

    res.json({ 
      success: true, 
      data: payments,
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip) }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: getError('INTERNAL_ERROR', { message: error.message })
    });
  }
};

module.exports = { recordPayment, getPayments };

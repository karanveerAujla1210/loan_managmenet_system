const express = require('express');
const Joi = require('joi');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const protect = require('../middleware/auth');
const auditMiddleware = require('../middleware/auditLog');
const { logAuditEvent } = require('../services/auditService');

const router = express.Router();

// Apply audit middleware
router.use(auditMiddleware);

const paymentSchema = Joi.object({
  paymentId: Joi.string().required(),
  loanId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'cheque', 'online', 'upi').required(),
  reference: Joi.string().allow('', null),
});

router.get('/', protect, async (req, res, next) => {
  try {
    const payments = await Payment.find().limit(100).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { error, value } = paymentSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const loan = await Loan.findById(value.loanId);
    if (!loan) return res.status(400).json({ message: 'Invalid loanId' });

    // Get current loan state before payment
    const loanBefore = {
      dpd: loan.dpd,
      paidAmount: loan.paidAmount || 0,
      remainingAmount: loan.remainingAmount || 0
    };

    const created = await Payment.create({ ...value, loanId: loan._id });

    // Log audit event for payment
    if (req.audit) {
      await logAuditEvent({
        action: 'payment_recorded',
        userId: req.audit.userId,
        userEmail: req.audit.userEmail,
        userName: req.audit.userName,
        userRole: req.audit.userRole,
        loanId: loan._id,
        loanIdStr: loan.loanId,
        oldValue: loanBefore,
        newValue: {
          dpd: loan.dpd,
          paidAmount: (loan.paidAmount || 0) + value.amount,
          remainingAmount: Math.max(0, (loan.remainingAmount || 0) - value.amount)
        },
        changedFields: ['paidAmount', 'remainingAmount', 'dpd'],
        remarks: `Payment of ₹${value.amount} via ${value.paymentMethod}`,
        amount: value.amount,
        ipAddress: req.audit.ipAddress,
        userAgent: req.audit.userAgent
      });
    }

    res.status(201).json(created);
  } catch (err) { next(err); }
});

module.exports = router;

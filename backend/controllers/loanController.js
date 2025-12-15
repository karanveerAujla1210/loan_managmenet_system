const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const { createLoan } = require('../services/loanService');
const { allocatePayment } = require('../services/paymentService');
const auditService = require('../services/auditService');

// Create new loan
exports.createLoan = async (req, res) => {
  try {
    const loan = await createLoan(req.body);
    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all loans with pagination
exports.getLoans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loans = await Loan.find()
      .populate('customerId', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments();

    res.json({
      success: true,
      data: loans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get loan by ID with schedule
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('customerId', 'firstName lastName phone email');
    
    if (!loan) {
      return res.status(404).json({ success: false, error: 'Loan not found' });
    }

    const schedule = await Schedule.find({ loanId: loan._id })
      .sort({ installmentNumber: 1 });

    const payments = await Payment.find({ loanId: loan._id })
      .sort({ paymentDate: -1 });

    res.json({
      success: true,
      data: {
        loan,
        schedule,
        payments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add payment to loan
exports.addPayment = async (req, res) => {
  try {
    const { loanId, amount, paymentDate, method, txnRef } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, error: 'Loan not found' });
    }

    const payment = await Payment.create({
      loanId,
      customerId: loan.customerId,
      amount,
      paymentDate,
      method,
      txnRef
    });

    // Allocate payment
    const schedules = await Schedule.find({ loanId }).sort({ installmentNumber: 1 });
    const allocation = await allocatePayment(loan, payment, schedules);
    
    await Payment.updateOne({ _id: payment._id }, { allocation });

    // Record audit event for payment recorded
    try {
      await auditService.logAuditEvent({
        action: 'payment_recorded',
        userId: req.user ? req.user._id : null,
        userEmail: req.user ? req.user.email : null,
        userName: req.user ? req.user.name : null,
        userRole: req.user ? req.user.role : null,
        loanId: loan._id,
        loanIdStr: String(loan._id),
        amount: payment.amount,
        newValue: payment,
        remarks: `Payment recorded via ${method}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (e) {
      console.error('Failed to write audit log for payment:', e.message);
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get loans by bucket
exports.getLoansByBucket = async (req, res) => {
  try {
    const { bucket } = req.params;
    
    const loans = await Loan.find({ bucket })
      .populate('customerId', 'firstName lastName phone')
      .sort({ dpd: -1 });

    res.json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = exports;
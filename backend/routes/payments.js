const express = require('express');
const Joi = require('joi');
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const auth = require('../middleware/auth');

const router = express.Router();

const paymentSchema = Joi.object({
  paymentId: Joi.string().required(),
  loanId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'cheque', 'online', 'upi').required(),
  reference: Joi.string().allow('', null),
});

router.get('/', auth(), async (req, res, next) => {
  try {
    const payments = await Payment.find().limit(100).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) { next(err); }
});

router.post('/', auth(), async (req, res, next) => {
  try {
    const { error, value } = paymentSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const loan = await Loan.findById(value.loanId);
    if (!loan) return res.status(400).json({ message: 'Invalid loanId' });

    const created = await Payment.create({ ...value, loanId: loan._id });
    res.status(201).json(created);
  } catch (err) { next(err); }
});

module.exports = router;

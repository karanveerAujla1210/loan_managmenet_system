const express = require('express');
const Joi = require('joi');
const Loan = require('../models/Loan');
const protect = require('../middleware/auth');

const router = express.Router();

const loanSchema = Joi.object({
  loanId: Joi.string().required(),
  customerId: Joi.string().required(),
  principalAmount: Joi.number().positive().required(),
  interestRate: Joi.number().positive().required(),
  tenure: Joi.number().integer().positive().required(),
  disbursedDate: Joi.date().optional(),
});

router.get('/', protect, async (req, res, next) => {
  try {
    const loans = await Loan.find().limit(100).sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { error, value } = loanSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const r = value.interestRate / 12 / 100;
    const n = value.tenure;
    const P = value.principalAmount;
    const emi = Number((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2);

    const created = await Loan.create({
      ...value,
      emiAmount: Number(emi),
      totalAmount: Number((emi * n).toFixed(2)),
    });
    res.status(201).json(created);
  } catch (err) { next(err); }
});

module.exports = router;

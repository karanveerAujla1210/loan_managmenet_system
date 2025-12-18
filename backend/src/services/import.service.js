const mongoose = require('mongoose');
const Loan = require('../models/loan.model');
const Installment = require('../models/installment.model');
const Payment = require('../models/payment.model');
const Customer = require('../models/customer.model');

const validateLoansImport = async (rows) => {
  const errors = [];
  const normalized = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors = [];

    if (!row.customerId?.trim()) rowErrors.push('customerId required');
    if (!row.principal || row.principal <= 0) rowErrors.push('principal must be positive');
    if (!row.annualInterestRate || row.annualInterestRate < 0) rowErrors.push('annualInterestRate required');
    if (!row.termMonths || row.termMonths <= 0) rowErrors.push('termMonths must be positive');

    if (rowErrors.length > 0) {
      errors.push({ row: i + 2, errors: rowErrors });
      continue;
    }

    const customer = await Customer.findById(row.customerId);
    if (!customer) {
      errors.push({ row: i + 2, errors: [`customer not found`] });
      continue;
    }

    normalized.push({
      customerId: row.customerId,
      principal: row.principal,
      annualInterestRate: row.annualInterestRate,
      termMonths: row.termMonths,
      productCode: row.productCode || 'business'
    });
  }

  return { errors, normalized };
};

const commitLoansImport = async (normalizedLoans) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdLoans = [];

    for (const loanData of normalizedLoans) {
      const loan = await Loan.create([{
        customerId: loanData.customerId,
        principal: loanData.principal,
        annualInterestRate: loanData.annualInterestRate,
        termMonths: loanData.termMonths,
        productCode: loanData.productCode,
        status: 'applied'
      }], { session });

      createdLoans.push(loan[0]._id);
    }

    await session.commitTransaction();
    return { success: true, loanCount: createdLoans.length };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const validatePaymentsImport = async (rows) => {
  const errors = [];
  const normalized = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors = [];

    if (!row.loanId?.trim()) rowErrors.push('loanId required');
    if (!row.amount || row.amount <= 0) rowErrors.push('amount must be positive');
    if (!row.paymentDate) rowErrors.push('paymentDate required');

    if (rowErrors.length > 0) {
      errors.push({ row: i + 2, errors: rowErrors });
      continue;
    }

    const loan = await Loan.findById(row.loanId);
    if (!loan) {
      errors.push({ row: i + 2, errors: [`loan not found`] });
      continue;
    }

    normalized.push({
      loanId: row.loanId,
      amount: row.amount,
      paymentDate: new Date(row.paymentDate)
    });
  }

  return { errors, normalized };
};

const commitPaymentsImport = async (normalizedPayments) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    let paymentCount = 0;

    for (const paymentData of normalizedPayments) {
      await Payment.create([{
        loanId: paymentData.loanId,
        amount: paymentData.amount,
        paymentDate: paymentData.paymentDate,
        status: 'confirmed'
      }], { session });

      totalAmount += paymentData.amount;
      paymentCount++;
    }

    await session.commitTransaction();
    return { success: true, paymentCount, totalAmount };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  validateLoansImport,
  commitLoansImport,
  validatePaymentsImport,
  commitPaymentsImport
};

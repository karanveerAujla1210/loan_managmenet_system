const mongoose = require('mongoose');
const { Loan, Instalment, LoanProduct, User } = require('../models');

/**
 * Step 1: Validate import data
 * Returns errors or normalized data (no DB writes)
 */
const validateLoansImport = async (rows) => {
  const errors = [];
  const normalized = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors = [];

    // Required fields
    if (!row.borrower_name?.trim()) rowErrors.push('borrower_name required');
    if (!row.phone?.trim()) rowErrors.push('phone required');
    if (!row.product_code?.trim()) rowErrors.push('product_code required');
    if (!row.loan_amount || row.loan_amount <= 0) rowErrors.push('loan_amount must be positive');
    if (!row.disbursement_date) rowErrors.push('disbursement_date required');
    if (!row.assigned_collector?.trim()) rowErrors.push('assigned_collector required');

    if (rowErrors.length > 0) {
      errors.push({ row: i + 2, errors: rowErrors });
      continue;
    }

    // Validate product exists
    const product = await LoanProduct.findOne({ productCode: row.product_code, active: true });
    if (!product) {
      errors.push({ row: i + 2, errors: [`product_code '${row.product_code}' not found`] });
      continue;
    }

    // Validate collector exists
    const collector = await User.findOne({
      $or: [
        { name: row.assigned_collector },
        { email: row.assigned_collector }
      ],
      role: 'COLLECTOR',
      active: true
    });
    if (!collector) {
      errors.push({ row: i + 2, errors: [`collector '${row.assigned_collector}' not found`] });
      continue;
    }

    // Validate date
    const disbDate = new Date(row.disbursement_date);
    if (isNaN(disbDate.getTime())) {
      errors.push({ row: i + 2, errors: ['disbursement_date invalid format (YYYY-MM-DD)'] });
      continue;
    }
    if (disbDate > new Date()) {
      errors.push({ row: i + 2, errors: ['disbursement_date cannot be in future'] });
      continue;
    }

    // Check duplicate (phone + date within 7 days)
    const duplicate = await Loan.findOne({
      phone: row.phone,
      disbursementDate: {
        $gte: new Date(disbDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        $lte: new Date(disbDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    if (duplicate) {
      errors.push({ row: i + 2, errors: ['duplicate loan detected (same phone within 7 days)'] });
      continue;
    }

    // Calculate totals
    const interest = row.loan_amount * (product.interestRate / 100);
    const totalPayable = row.loan_amount + interest;
    const weeklyEmi = totalPayable / product.totalInstalments;

    normalized.push({
      borrowerName: row.borrower_name.trim(),
      phone: row.phone.trim(),
      productId: product._id,
      loanAmount: row.loan_amount,
      totalPayable: Math.round(totalPayable * 100) / 100,
      weeklyEmi: Math.round(weeklyEmi * 100) / 100,
      disbursementDate: disbDate,
      assignedTo: collector._id,
      product,
      collector
    });
  }

  return { errors, normalized };
};

/**
 * Step 2: Generate preview with calculated instalments
 */
const generatePreview = (normalizedLoans) => {
  return normalizedLoans.map(loan => {
    const instalments = [];
    let currentDate = new Date(loan.disbursementDate);

    for (let i = 1; i <= loan.product.totalInstalments; i++) {
      currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      instalments.push({
        instalmentNo: i,
        dueDate: currentDate.toISOString().split('T')[0],
        dueAmount: loan.weeklyEmi
      });
    }

    return {
      borrowerName: loan.borrowerName,
      phone: loan.phone,
      loanAmount: loan.loanAmount,
      totalPayable: loan.totalPayable,
      weeklyEmi: loan.weeklyEmi,
      disbursementDate: loan.disbursementDate.toISOString().split('T')[0],
      collectorName: loan.collector.name,
      productCode: loan.product.productCode,
      firstThreeInstalments: instalments.slice(0, 3)
    };
  });
};

/**
 * Step 3: Atomic commit - create loans + instalments in transaction
 */
const commitLoansImport = async (normalizedLoans, batchId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdLoans = [];

    for (const loanData of normalizedLoans) {
      // Create loan
      const loan = await Loan.create([{
        borrowerName: loanData.borrowerName,
        phone: loanData.phone,
        productId: loanData.productId,
        loanAmount: loanData.loanAmount,
        totalPayable: loanData.totalPayable,
        disbursementDate: loanData.disbursementDate,
        assignedTo: loanData.assignedTo,
        status: 'ACTIVE',
        outstandingAmount: loanData.totalPayable
      }], { session });

      // Generate instalments
      const instalments = [];
      let currentDate = new Date(loanData.disbursementDate);

      for (let i = 1; i <= loanData.product.totalInstalments; i++) {
        currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        instalments.push({
          loanId: loan[0]._id,
          instalmentNo: i,
          dueDate: currentDate,
          dueAmount: loanData.weeklyEmi,
          paidAmount: 0,
          status: 'DUE'
        });
      }

      await Instalment.insertMany(instalments, { session });
      createdLoans.push(loan[0]._id);
    }

    await session.commitTransaction();
    return { success: true, loanCount: createdLoans.length, batchId };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Step 4: Validate payments import
 */
const validatePaymentsImport = async (rows) => {
  const errors = [];
  const normalized = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors = [];

    if (!row.loan_identifier?.trim()) rowErrors.push('loan_identifier required');
    if (!row.instalment_no || row.instalment_no <= 0) rowErrors.push('instalment_no must be positive');
    if (!row.amount || row.amount <= 0) rowErrors.push('amount must be positive');
    if (!row.payment_date) rowErrors.push('payment_date required');
    if (!row.mode?.trim()) rowErrors.push('mode required');

    if (rowErrors.length > 0) {
      errors.push({ row: i + 2, errors: rowErrors });
      continue;
    }

    // Find loan by phone or loanId
    const loan = await Loan.findOne({
      $or: [
        { phone: row.loan_identifier },
        { _id: row.loan_identifier }
      ]
    });
    if (!loan) {
      errors.push({ row: i + 2, errors: [`loan '${row.loan_identifier}' not found`] });
      continue;
    }

    // Find instalment
    const instalment = await Instalment.findOne({
      loanId: loan._id,
      instalmentNo: row.instalment_no
    });
    if (!instalment) {
      errors.push({ row: i + 2, errors: [`instalment ${row.instalment_no} not found for this loan`] });
      continue;
    }

    const paymentDate = new Date(row.payment_date);
    if (isNaN(paymentDate.getTime())) {
      errors.push({ row: i + 2, errors: ['payment_date invalid format (YYYY-MM-DD)'] });
      continue;
    }

    normalized.push({
      loanId: loan._id,
      instalmentId: instalment._id,
      amount: row.amount,
      paymentDate,
      mode: row.mode.trim(),
      reference: row.reference?.trim() || null
    });
  }

  return { errors, normalized };
};

/**
 * Step 5: Commit payments import
 */
const commitPaymentsImport = async (normalizedPayments) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { Payment } = require('../models');
    let totalAmount = 0;
    let paymentCount = 0;

    for (const paymentData of normalizedPayments) {
      // Create payment
      await Payment.create([{
        loanId: paymentData.loanId,
        instalmentId: paymentData.instalmentId,
        amount: paymentData.amount,
        mode: paymentData.mode,
        reference: paymentData.reference,
        paymentDate: paymentData.paymentDate
      }], { session });

      // Update instalment
      const instalment = await Instalment.findById(paymentData.instalmentId).session(session);
      instalment.paidAmount += paymentData.amount;

      if (instalment.paidAmount >= instalment.dueAmount) {
        instalment.status = 'PAID';
        instalment.paidOn = new Date();
      } else if (instalment.paidAmount > 0) {
        instalment.status = 'PARTIAL';
      }

      await instalment.save({ session });

      // Update loan outstanding
      const loan = await Loan.findById(paymentData.loanId).session(session);
      loan.outstandingAmount = Math.max(0, loan.outstandingAmount - paymentData.amount);
      await loan.save({ session });

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
  generatePreview,
  commitLoansImport,
  validatePaymentsImport,
  commitPaymentsImport
};

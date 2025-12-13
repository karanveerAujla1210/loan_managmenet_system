const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const { generateLoanSchedule } = require('../utils/scheduleGenerator');
const { allocatePayment } = require('../utils/paymentAllocator');

async function createLoan(disbursementData) {
  const { principal, disbursementDate, customerId, loanId, branch } = disbursementData;

  const calc = generateLoanSchedule(principal, disbursementDate);

  const loan = await Loan.create({
    loanId,
    customerId,
    principal,
    pfAmount: calc.pfAmount,
    gstAmount: calc.gstAmount,
    totalPF: calc.totalPF,
    netDisbursement: calc.netDisbursement,
    interestAmount: calc.interestAmount,
    totalRepayable: calc.totalRepayable,
    installmentCount: 14,
    weeklyEmi: calc.weeklyEmi,
    disbursementDate,
    branch
  });

  // Insert schedule
  const scheduleData = calc.schedule.map(s => ({ ...s, loanId: loan._id }));
  await Schedule.insertMany(scheduleData);

  return loan;
}

async function linkImportedData(disbursements, payments) {
  for (const d of disbursements) {
    // Find or create customer
    const existingCustomer = await Customer.findOne({ phone: d.mobileNumber }) ||
                              await Customer.create({
                                firstName: d.customerName.split(" ")[0],
                                lastName: d.customerName.split(" ")[1] || "",
                                phone: d.mobileNumber
                              });

    // Create loan
    const loan = await createLoan({
      principal: d.loanAmount,
      disbursementDate: d.dateOfDisbursement,
      customerId: existingCustomer._id,
      loanId: d.loanId,
      branch: d.branch
    });

    // Link payments
    const loanPayments = payments.filter(p => p.LoanID === d.loanId);
    
    for (const p of loanPayments) {
      const payment = await Payment.create({
        externalLoanId: p.LoanID,
        loanId: loan._id,
        customerId: existingCustomer._id,
        amount: p.Amount,
        paymentDate: p.PaymentDate,
        method: p.PaymentMode,
        txnRef: p.ReferenceNumber
      });

      // Allocate payment
      const schedules = await Schedule.find({ loanId: loan._id }).sort({ installmentNumber: 1 });
      const { allocation } = allocatePayment(payment, schedules);
      
      await Payment.updateOne({ _id: payment._id }, { allocation });
      await Schedule.updateMany({ loanId: loan._id }, schedules);
    }
  }
}

module.exports = { createLoan, linkImportedData };
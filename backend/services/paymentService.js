const Schedule = require('../models/Schedule');

async function allocatePayment(loan, payment, schedules) {
  let remaining = payment.amount;
  const penaltyCharge = 250;

  // Find next unpaid installment
  const nextInstallment = schedules.find(i => i.status !== "paid");

  if (!nextInstallment) return { principal: 0, interest: 0, penalty: 0, excess: remaining };

  const isLate = new Date(payment.paymentDate) > nextInstallment.dueDate;
  const penalty = isLate ? penaltyCharge : 0;

  let allocation = {
    principal: 0,
    interest: 0,
    penalty,
    excess: 0
  };

  let totalDue = nextInstallment.remainingAmount + penalty;

  if (remaining >= totalDue) {
    // FULL PAYMENT
    allocation.excess = remaining - totalDue;
    nextInstallment.paidAmount = nextInstallment.amount;
    nextInstallment.remainingAmount = 0;
    nextInstallment.status = "paid";
  } else {
    // PARTIAL PAYMENT
    const paymentForInstallment = Math.min(remaining, nextInstallment.remainingAmount);
    nextInstallment.paidAmount += paymentForInstallment;
    nextInstallment.remainingAmount -= paymentForInstallment;
    nextInstallment.status = nextInstallment.remainingAmount > 0 ? "partial" : "paid";
    remaining -= paymentForInstallment;
  }

  await Schedule.updateOne(
    { _id: nextInstallment._id },
    {
      paidAmount: nextInstallment.paidAmount,
      remainingAmount: nextInstallment.remainingAmount,
      status: nextInstallment.status
    }
  );

  return allocation;
}

module.exports = { allocatePayment };
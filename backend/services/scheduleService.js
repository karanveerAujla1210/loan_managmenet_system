function generateWeeklySchedule(principal, disbursementDate) {
  const pfAmount = Math.round(principal * 0.10);
  const gstAmount = Math.round(pfAmount * 0.18);
  const totalPF = pfAmount + gstAmount;
  const netDisbursement = principal - totalPF;

  const interestAmount = Math.round(principal * 0.20); // flat 20% for 100 days
  const totalRepayable = principal + interestAmount;

  const installments = 14;
  const weeklyEmi = Math.round(totalRepayable / installments);

  let schedule = [];
  let dueDate = new Date(disbursementDate);

  for (let i = 1; i <= installments; i++) {
    dueDate = new Date(dueDate.getTime() + (7 * 86400000));

    schedule.push({
      installmentNumber: i,
      dueDate: new Date(dueDate),
      amount: weeklyEmi,
      principal: null,
      interest: null,
      remainingAmount: weeklyEmi,
      paidAmount: 0,
      status: "pending"
    });
  }

  return {
    pfAmount,
    gstAmount,
    totalPF,
    netDisbursement,
    interestAmount,
    totalRepayable,
    weeklyEmi,
    schedule
  };
}

module.exports = { generateWeeklySchedule };
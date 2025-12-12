function toFixedNumber(x, digits = 2) {
  return Math.round((x + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}

/**
 * Generate amortization schedule for reducing interest monthly EMI
 * @param {number} principal - loan amount
 * @param {number} annualRate - annual % (e.g., 12)
 * @param {number} termMonths - integer
 * @param {Date} startDate - Date of disbursement
 * @returns {Array} array of installments
 */
function generateScheduleReducing(principal, annualRate, termMonths, startDate = new Date()) {
  if (principal <= 0 || termMonths <= 0) {
    throw new Error('Principal and term must be positive');
  }

  const r = annualRate / 12 / 100; // monthly rate decimal
  
  // Zero interest case
  if (r === 0) {
    const principalPart = toFixedNumber(principal / termMonths);
    const schedule = [];
    for (let i = 1; i <= termMonths; i++) {
      schedule.push({
        sequence: i,
        dueDate: new Date(startDate.getFullYear(), startDate.getMonth() + i, startDate.getDate()),
        principalDue: principalPart,
        interestDue: 0,
        totalDue: principalPart,
        remaining: toFixedNumber(principal - (principalPart * i))
      });
    }
    return schedule;
  }

  // EMI formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const pow = Math.pow(1 + r, termMonths);
  const emi = toFixedNumber((principal * r * pow) / (pow - 1));
  
  let balance = principal;
  const schedule = [];
  
  for (let m = 1; m <= termMonths; m++) {
    const interest = toFixedNumber(balance * r);
    let principalPart = toFixedNumber(emi - interest);
    
    // Last installment adjustment
    if (m === termMonths) {
      principalPart = balance;
    }
    
    const remaining = toFixedNumber(balance - principalPart);
    
    schedule.push({
      sequence: m,
      dueDate: new Date(startDate.getFullYear(), startDate.getMonth() + m, startDate.getDate()),
      principalDue: principalPart,
      interestDue: interest,
      totalDue: toFixedNumber(principalPart + interest),
      remaining: remaining < 0.01 ? 0 : remaining
    });
    
    balance = remaining;
  }
  
  return schedule;
}

/**
 * Calculate penalty for overdue installment
 * @param {number} overdueAmount - amount overdue
 * @param {number} daysPastDue - days past due date
 * @param {number} penaltyRate - annual penalty rate %
 * @returns {number} penalty amount
 */
function calculatePenalty(overdueAmount, daysPastDue, penaltyRate = 24) {
  if (daysPastDue <= 0) return 0;
  const dailyRate = penaltyRate / 365 / 100;
  return toFixedNumber(overdueAmount * dailyRate * daysPastDue);
}

/**
 * Calculate total outstanding for a loan
 * @param {Array} schedule - loan schedule
 * @returns {Object} outstanding breakdown
 */
function calculateOutstanding(schedule) {
  let totalPrincipal = 0;
  let totalInterest = 0;
  let totalPenalty = 0;
  let paidPrincipal = 0;
  let paidInterest = 0;
  let paidPenalty = 0;

  schedule.forEach(inst => {
    totalPrincipal += inst.principalDue;
    totalInterest += inst.interestDue;
    totalPenalty += inst.penaltyDue || 0;
    paidPrincipal += inst.paidPrincipal || 0;
    paidInterest += inst.paidInterest || 0;
    paidPenalty += inst.paidPenalty || 0;
  });

  return {
    outstandingPrincipal: toFixedNumber(totalPrincipal - paidPrincipal),
    outstandingInterest: toFixedNumber(totalInterest - paidInterest),
    outstandingPenalty: toFixedNumber(totalPenalty - paidPenalty),
    totalOutstanding: toFixedNumber((totalPrincipal + totalInterest + totalPenalty) - (paidPrincipal + paidInterest + paidPenalty))
  };
}

module.exports = {
  generateScheduleReducing,
  calculatePenalty,
  calculateOutstanding,
  toFixedNumber
};
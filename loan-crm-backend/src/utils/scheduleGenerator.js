const moment = require('moment');
const dateUtils = require('./dateUtils');

class ScheduleGenerator {
  static generateEMISchedule(loanData) {
    const {
      principalAmount,
      interestRate,
      tenure,
      disbursementDate,
      tenureType = 'MONTHS'
    } = loanData;

    const monthlyRate = interestRate / (12 * 100);
    const totalInstallments = tenureType === 'MONTHS' ? tenure : Math.ceil(tenure / 30);
    
    // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = this.calculateEMI(principalAmount, monthlyRate, totalInstallments);
    
    const schedule = [];
    let remainingPrincipal = principalAmount;
    let currentDate = moment(disbursementDate);

    for (let i = 1; i <= totalInstallments; i++) {
      const dueDate = dateUtils.getNextEMIDate(disbursementDate, i);
      const interestAmount = remainingPrincipal * monthlyRate;
      const principalAmount = Math.min(emi - interestAmount, remainingPrincipal);
      
      remainingPrincipal -= principalAmount;

      schedule.push({
        installmentNumber: i,
        dueDate,
        principalAmount: Math.round(principalAmount * 100) / 100,
        interestAmount: Math.round(interestAmount * 100) / 100,
        totalAmount: Math.round(emi * 100) / 100,
        principalOutstanding: Math.round(remainingPrincipal * 100) / 100,
        interestOutstanding: Math.round(interestAmount * 100) / 100,
        totalOutstanding: Math.round(emi * 100) / 100,
        status: 'PENDING',
        dpd: 0
      });

      // Break if principal is fully paid
      if (remainingPrincipal <= 0.01) break;
    }

    return {
      schedule,
      emi: Math.round(emi * 100) / 100,
      totalAmount: Math.round(schedule.reduce((sum, inst) => sum + inst.totalAmount, 0) * 100) / 100,
      totalInterest: Math.round(schedule.reduce((sum, inst) => sum + inst.interestAmount, 0) * 100) / 100
    };
  }

  static calculateEMI(principal, monthlyRate, tenure) {
    if (monthlyRate === 0) {
      return principal / tenure;
    }
    
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure);
    const denominator = Math.pow(1 + monthlyRate, tenure) - 1;
    
    return numerator / denominator;
  }

  static generateReducingBalanceSchedule(loanData) {
    // For reducing balance method
    return this.generateEMISchedule(loanData);
  }

  static generateFlatRateSchedule(loanData) {
    const {
      principalAmount,
      interestRate,
      tenure,
      disbursementDate,
      tenureType = 'MONTHS'
    } = loanData;

    const totalInstallments = tenureType === 'MONTHS' ? tenure : Math.ceil(tenure / 30);
    const totalInterest = (principalAmount * interestRate * tenure) / (12 * 100);
    const totalAmount = principalAmount + totalInterest;
    const emi = totalAmount / totalInstallments;
    const principalPerInstallment = principalAmount / totalInstallments;
    const interestPerInstallment = totalInterest / totalInstallments;

    const schedule = [];
    let remainingPrincipal = principalAmount;

    for (let i = 1; i <= totalInstallments; i++) {
      const dueDate = dateUtils.getNextEMIDate(disbursementDate, i);
      
      remainingPrincipal -= principalPerInstallment;

      schedule.push({
        installmentNumber: i,
        dueDate,
        principalAmount: Math.round(principalPerInstallment * 100) / 100,
        interestAmount: Math.round(interestPerInstallment * 100) / 100,
        totalAmount: Math.round(emi * 100) / 100,
        principalOutstanding: Math.round(interestPerInstallment * 100) / 100,
        interestOutstanding: Math.round(interestPerInstallment * 100) / 100,
        totalOutstanding: Math.round(emi * 100) / 100,
        status: 'PENDING',
        dpd: 0
      });
    }

    return {
      schedule,
      emi: Math.round(emi * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100
    };
  }

  static restructureSchedule(existingSchedule, restructureData) {
    const { newTenure, newRate, restructureDate, pendingAmount } = restructureData;
    
    // Mark existing unpaid installments as restructured
    const restructuredSchedule = existingSchedule.map(installment => {
      if (installment.status === 'PENDING' && moment(installment.dueDate).isAfter(restructureDate)) {
        return { ...installment, isRestructured: true, status: 'RESTRUCTURED' };
      }
      return installment;
    });

    // Generate new schedule for pending amount
    const newScheduleData = this.generateEMISchedule({
      principalAmount: pendingAmount,
      interestRate: newRate,
      tenure: newTenure,
      disbursementDate: restructureDate
    });

    // Append new schedule
    const maxInstallmentNumber = Math.max(...restructuredSchedule.map(s => s.installmentNumber));
    const newSchedule = newScheduleData.schedule.map((installment, index) => ({
      ...installment,
      installmentNumber: maxInstallmentNumber + index + 1,
      isRestructured: true
    }));

    return [...restructuredSchedule, ...newSchedule];
  }
}

module.exports = ScheduleGenerator;
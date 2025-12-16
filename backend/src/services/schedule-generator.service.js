const Installment = require('../models/installment.model');
const moment = require('moment');

class ScheduleGeneratorService {
  static async generateSchedule(loanId, principal, interestRate, tenure, disbursementDate) {
    const emiAmount = this.calculateEMI(principal, interestRate, tenure);
    const installments = [];

    for (let i = 1; i <= tenure; i++) {
      const dueDate = moment(disbursementDate).add(i * 7, 'days').toDate();
      
      installments.push({
        loanId,
        installmentNo: i,
        dueDate,
        emiAmount,
        paidAmount: 0,
        remainingAmount: emiAmount,
        penalty: 0,
        status: 'PENDING'
      });
    }

    await Installment.insertMany(installments);
    return installments;
  }

  static calculateEMI(principal, annualRate, months) {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / months;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi * 100) / 100;
  }
}

module.exports = ScheduleGeneratorService;

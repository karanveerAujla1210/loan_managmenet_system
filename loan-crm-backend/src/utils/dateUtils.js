const moment = require('moment');

const dateUtils = {
  // Add business days to a date
  addBusinessDays: (date, days) => {
    const result = moment(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.add(1, 'day');
      if (result.day() !== 0 && result.day() !== 6) { // Skip weekends
        addedDays++;
      }
    }
    return result.toDate();
  },

  // Calculate DPD (Days Past Due)
  calculateDPD: (dueDate, currentDate = new Date()) => {
    const due = moment(dueDate);
    const current = moment(currentDate);
    
    if (current.isSameOrBefore(due, 'day')) {
      return 0;
    }
    
    return current.diff(due, 'days');
  },

  // Get next EMI date
  getNextEMIDate: (disbursementDate, installmentNumber, frequency = 'monthly') => {
    const startDate = moment(disbursementDate);
    
    switch (frequency) {
      case 'weekly':
        return startDate.add(installmentNumber * 7, 'days').toDate();
      case 'fortnightly':
        return startDate.add(installmentNumber * 14, 'days').toDate();
      case 'monthly':
        return startDate.add(installmentNumber, 'months').toDate();
      case 'quarterly':
        return startDate.add(installmentNumber * 3, 'months').toDate();
      default:
        return startDate.add(installmentNumber, 'months').toDate();
    }
  },

  // Format date for display
  formatDate: (date, format = 'DD/MM/YYYY') => {
    return moment(date).format(format);
  },

  // Check if date is holiday (basic implementation)
  isHoliday: (date) => {
    const day = moment(date).day();
    return day === 0 || day === 6; // Weekend
  },

  // Get financial year
  getFinancialYear: (date = new Date()) => {
    const year = moment(date).year();
    const month = moment(date).month();
    
    if (month >= 3) { // April onwards
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  },

  // Get age from DOB
  getAge: (dob) => {
    return moment().diff(moment(dob), 'years');
  },

  // Get days between dates
  daysBetween: (startDate, endDate) => {
    return moment(endDate).diff(moment(startDate), 'days');
  },

  // Get start and end of month
  getMonthRange: (date = new Date()) => {
    const start = moment(date).startOf('month').toDate();
    const end = moment(date).endOf('month').toDate();
    return { start, end };
  },

  // Check if date is valid
  isValidDate: (date) => {
    return moment(date).isValid();
  }
};

module.exports = dateUtils;
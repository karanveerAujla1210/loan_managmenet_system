const Loan = require('../models/Loan');
const Instalment = require('../models/Instalment');
const Payment = require('../models/Payment');
const User = require('../models/User');
const moment = require('moment');

class ImportService {
  static async importCustomers(data) {
    return { success: 0, failed: 0, errors: ['Customer import not implemented'] };
  }

  static async importLoans(data) {
    return { success: 0, failed: 0, errors: ['Loan import not implemented'] };
  }

  static async importPayments(data) {
    return { success: 0, failed: 0, errors: ['Payment import not implemented'] };
  }

  static async importUsers(data) {
    return { success: 0, failed: 0, errors: ['User import not implemented'] };
  }
}

module.exports = ImportService;

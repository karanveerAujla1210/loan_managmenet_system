const Loan = require('./loans.model');
const Customer = require('../customers/customers.model');
const { successResponse, errorResponse } = require('../../utils/responses');
const { generateLoanSchedule } = require('../../utils/loanHelpers');

class ImportController {
  async importLoanData(req, res) {
    try {
      const { data } = req.body;
      const results = [];

      for (const item of data) {
        const { loan, payments } = item;
        
        // Create or update customer
        let customer = await Customer.findOne({ phone: loan.mobile_number.toString() });
        if (!customer) {
          const nameParts = loan.customer_name.split(' ');
          customer = new Customer({
            firstName: nameParts[0] || 'Unknown',
            lastName: nameParts.slice(1).join(' ') || 'Customer',
            phone: loan.mobile_number.toString(),
            email: `${loan.customer_name.toLowerCase().replace(/\s+/g, '')}@temp.com`,
            status: 'active'
          });
          await customer.save();
        }

        // Create or update loan
        let existingLoan = await Loan.findOne({ loanId: loan.loan_id });
        if (!existingLoan) {
          const totalAmount = loan.loan_amount * 1.24; // 24% interest
          const installmentAmount = totalAmount / 14;
          
          const loanData = {
            principalAmount: loan.loan_amount,
            interestRate: 24,
            numberOfInstallments: 14,
            frequency: 'weekly',
            startDate: new Date(loan.date_of_disbursement)
          };
          
          const schedule = generateLoanSchedule(loanData);
          
          const newLoan = new Loan({
            loanId: loan.loan_id,
            uniqueId: loan.unique_id,
            customerId: customer._id,
            branch: loan.branch,
            loanType: loan.type,
            principalAmount: loan.loan_amount,
            interestRate: 24,
            totalAmount,
            installmentAmount,
            numberOfInstallments: 14,
            frequency: 'weekly',
            startDate: new Date(loan.date_of_disbursement),
            endDate: new Date(new Date(loan.date_of_disbursement).getTime() + (14 * 7 * 24 * 60 * 60 * 1000)),
            outstandingAmount: totalAmount,
            disbursement: {
              date: new Date(loan.date_of_disbursement),
              processingFees: loan.processing_fees,
              gst: loan.gst,
              netDisbursement: loan.net_disbursement,
              utr: loan.utr,
              status: 'disbursed'
            },
            status: loan.status.toLowerCase(),
            schedule,
            events: [{
              type: 'created',
              description: 'Loan imported from disbursement data',
              payload: { amount: loan.loan_amount }
            }]
          });
          
          await newLoan.save();
          existingLoan = newLoan;
        }

        // Import payments
        let totalPaid = 0;
        for (const payment of payments) {
          const existingTransaction = existingLoan.transactions.find(
            t => t.referenceNumber === payment.reference_number.toString()
          );
          
          if (!existingTransaction) {
            existingLoan.transactions.push({
              transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
              type: 'payment',
              amount: payment.amount,
              date: new Date(payment.payment_date),
              method: 'upi',
              referenceNumber: payment.reference_number.toString(),
              paymentMode: payment.payment_mode,
              remarks: payment.remarks || '',
              allocatedTo: []
            });
            
            totalPaid += payment.amount;
          }
        }

        existingLoan.paidAmount = totalPaid;
        existingLoan.outstandingAmount = existingLoan.totalAmount - totalPaid;
        existingLoan.updateMetrics();
        await existingLoan.save();
        
        results.push({
          loanId: loan.loan_id,
          status: 'imported',
          paymentsCount: payments.length,
          totalPaid
        });
      }

      return successResponse(res, results, 'Data imported successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ImportController();
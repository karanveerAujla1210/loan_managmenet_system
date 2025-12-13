const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Schedule = require('../models/Schedule');

async function getDashboardStats() {
  const [
    totalLoans,
    activeLoans,
    totalDisbursed,
    totalCollected,
    bucketStats,
    recentPayments
  ] = await Promise.all([
    Loan.countDocuments(),
    Loan.countDocuments({ status: 'active' }),
    Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$netDisbursement' } } }
    ]),
    Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Loan.aggregate([
      { $group: { _id: '$bucket', count: { $sum: 1 }, totalAmount: { $sum: '$totalRepayable' } } }
    ]),
    Payment.find()
      .populate('loanId', 'loanId')
      .populate('customerId', 'firstName lastName')
      .sort({ paymentDate: -1 })
      .limit(10)
  ]);

  return {
    totalLoans,
    activeLoans,
    totalDisbursed: totalDisbursed[0]?.total || 0,
    totalCollected: totalCollected[0]?.total || 0,
    bucketStats,
    recentPayments
  };
}

async function getCollectionReport() {
  const buckets = ['current', '1-7', '8-15', '16-22', '23-29', '30+', '60+', '90+', '120+'];
  
  const report = await Promise.all(
    buckets.map(async (bucket) => {
      const loans = await Loan.find({ bucket })
        .populate('customerId', 'firstName lastName phone');
      
      const totalAmount = loans.reduce((sum, loan) => sum + loan.totalRepayable, 0);
      
      return {
        bucket,
        count: loans.length,
        totalAmount,
        loans
      };
    })
  );

  return report;
}

module.exports = { getDashboardStats, getCollectionReport };
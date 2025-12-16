const Payment = require('../models/payment.model');
const Loan = require('../models/loan.model');

const matchPayments = async (bankStatements) => {
  const results = {
    exactMatches: [],
    semiMatches: [],
    looseMatches: [],
    unmatched: []
  };
  
  for (const stmt of bankStatements) {
    let matched = false;
    
    // Step 1: Exact match (UTR + Amount + Date ±1 day)
    const exactMatch = await Payment.findOne({
      utr: stmt.utr,
      amount: stmt.amount,
      paymentDate: {
        $gte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() - 1),
        $lte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() + 1)
      }
    });
    
    if (exactMatch) {
      results.exactMatches.push({ statement: stmt, payment: exactMatch, status: 'MATCHED' });
      matched = true;
      continue;
    }
    
    // Step 2: Semi match (Amount + Date ±1 day + LoanId)
    const semiMatch = await Payment.findOne({
      amount: stmt.amount,
      paymentDate: {
        $gte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() - 1),
        $lte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() + 1)
      },
      loanId: { $exists: true }
    });
    
    if (semiMatch) {
      results.semiMatches.push({ statement: stmt, payment: semiMatch, status: 'REVIEW' });
      matched = true;
      continue;
    }
    
    // Step 3: Loose match (Amount + Date ±2 days)
    const looseMatch = await Payment.findOne({
      amount: stmt.amount,
      paymentDate: {
        $gte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() - 2),
        $lte: new Date(stmt.transactionDate).setDate(new Date(stmt.transactionDate).getDate() + 2)
      }
    });
    
    if (looseMatch) {
      results.looseMatches.push({ statement: stmt, payment: looseMatch, status: 'FLAG' });
      matched = true;
    }
    
    if (!matched) {
      results.unmatched.push({ statement: stmt, status: 'UNLINKED_PAYMENT' });
    }
  }
  
  return results;
};

const reconcilePayments = async (matchedPayments) => {
  for (const match of matchedPayments) {
    await Payment.findByIdAndUpdate(match.payment._id, {
      reconciled: true,
      reconciledAt: new Date()
    });
  }
  
  return { success: true, reconciledCount: matchedPayments.length };
};

module.exports = {
  matchPayments,
  reconcilePayments
};

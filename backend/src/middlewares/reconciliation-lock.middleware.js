const BankReconciliation = require('../models/bank-reconciliation.model');

const reconciliationLockGuard = async (req, res, next) => {
  if (!['PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  if (!req.path.includes('/reconciliation')) return next();

  const reconId = req.params.id;
  if (!reconId) return next();

  const recon = await BankReconciliation.findById(reconId);
  if (!recon) return next();

  if (recon.status === 'LOCKED') {
    return res.status(403).json({
      success: false,
      message: 'Cannot modify locked reconciliation'
    });
  }

  next();
};

module.exports = reconciliationLockGuard;

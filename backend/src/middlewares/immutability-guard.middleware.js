const immutabilityGuard = (req, res, next) => {
  const immutableFields = {
    loans: ['principal', 'schedule', 'disbursementDate'],
    payments: ['amount', 'txnRef'],
    installments: ['emiAmount', 'dueDate']
  };

  if (!['PUT', 'PATCH'].includes(req.method)) return next();
  if (!req.body) return next();

  let resource = null;
  if (req.path.includes('/loans')) resource = 'loans';
  if (req.path.includes('/payments')) resource = 'payments';
  if (req.path.includes('/installments')) resource = 'installments';

  if (!resource) return next();

  const attempted = immutableFields[resource].filter(f => f in req.body);
  if (attempted.length === 0) return next();

  return res.status(403).json({
    success: false,
    message: `Cannot modify immutable fields: ${attempted.join(', ')}`
  });
};

module.exports = immutabilityGuard;

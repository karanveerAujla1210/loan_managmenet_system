const AuditLog = require('../models/audit-log.model');

const financialGuard = async (req, res, next) => {
  const readOnlyFields = ['dpd', 'bucket', 'status', 'principal', 'schedule', 'outstandingAmount'];
  const forbiddenMethods = { PUT: true, PATCH: true };

  if (!forbiddenMethods[req.method]) return next();
  if (!req.body) return next();

  const attempted = readOnlyFields.filter(f => f in req.body);
  if (attempted.length === 0) return next();

  await AuditLog.create({
    action: 'UNAUTHORIZED_FIELD_MODIFICATION_ATTEMPT',
    entity: 'LOAN',
    entityId: req.params.id,
    userId: req.user?.id,
    changes: { attempted },
    ipAddress: req.ip,
    status: 'FAILED',
    errorMessage: `Attempted to modify: ${attempted.join(', ')}`
  });

  return res.status(403).json({
    success: false,
    message: 'Cannot modify calculated fields',
    forbiddenFields: attempted
  });
};

module.exports = financialGuard;

const AuditLog = require('../models/audit-log.model');

const auditMiddleware = (action, entity) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = function(data) {
      if (data.success && req.user) {
        AuditLog.create({
          action,
          entity,
          entityId: req.body.id || req.params.id,
          userId: req.user.id,
          changes: { after: req.body },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          status: 'SUCCESS'
        }).catch(err => console.error('Audit log error:', err));
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = auditMiddleware;

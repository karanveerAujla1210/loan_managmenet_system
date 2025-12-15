/**
 * Middleware to capture request details for audit logging
 * Attaches req.audit object with user and connection info
 */

function auditMiddleware(req, res, next) {
  req.audit = {
    userId: req.user?._id || null,
    userEmail: req.user?.email || null,
    userName: req.user?.name || null,
    userRole: req.user?.role || null,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };

  next();
}

module.exports = auditMiddleware;

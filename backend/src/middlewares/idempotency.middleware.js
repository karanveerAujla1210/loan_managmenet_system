const crypto = require('crypto');

const idempotencyCache = new Map();

const idempotencyMiddleware = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: 'Idempotency-Key header required for financial operations'
    });
  }

  if (idempotencyCache.has(idempotencyKey)) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate request detected',
      cachedResponse: idempotencyCache.get(idempotencyKey)
    });
  }

  const originalJson = res.json;
  res.json = function(data) {
    idempotencyCache.set(idempotencyKey, data);
    setTimeout(() => idempotencyCache.delete(idempotencyKey), 3600000); // 1 hour
    return originalJson.call(this, data);
  };

  next();
};

module.exports = idempotencyMiddleware;

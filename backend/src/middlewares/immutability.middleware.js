const immutabilityGuard = (req, res, next) => {
  const forbiddenFields = ['dpd', 'bucket', 'status', 'principal', 'schedule'];
  
  if (req.body) {
    const attemptedChanges = forbiddenFields.filter(field => field in req.body);
    if (attemptedChanges.length > 0) {
      return res.status(403).json({
        success: false,
        message: `Cannot directly modify: ${attemptedChanges.join(', ')}. Use appropriate service.`,
        forbiddenFields: attemptedChanges
      });
    }
  }
  
  next();
};

module.exports = immutabilityGuard;

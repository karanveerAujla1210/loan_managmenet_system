const permissionGuard = (req, res, next) => {
  const role = req.user?.role;
  const method = req.method;
  const path = req.path;

  // Collectors cannot edit loans
  if (role === 'collector' && ['PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (path.includes('/loans') || path.includes('/payments') || path.includes('/reconciliation')) {
      return res.status(403).json({ success: false, message: 'Collectors cannot edit loans' });
    }
  }

  // Managers cannot edit payments
  if (role === 'manager' && ['PUT', 'PATCH'].includes(method)) {
    if (path.includes('/payments') && !path.includes('/manual')) {
      return res.status(403).json({ success: false, message: 'Managers cannot edit payments' });
    }
  }

  // Legal cannot record payments
  if (role === 'legal' && ['POST', 'PUT', 'PATCH'].includes(method)) {
    if (path.includes('/payments')) {
      return res.status(403).json({ success: false, message: 'Legal cannot record payments' });
    }
  }

  next();
};

module.exports = permissionGuard;

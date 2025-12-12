module.exports = function errorHandler(err, req, res, next) {
  // Default to 500
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Avoid leaking stack traces in production
  const response = { message };
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

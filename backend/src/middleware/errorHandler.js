const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      errors: err.errors,
    });
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // CastError (invalid ObjectId / bad parameter)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for parameter: ${err.path}`,
    });
  }

  // Fallback internal server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
};

module.exports = { errorHandler };

const ApiError = require("../utils/ApiError");

// 404 handler for unmatched routes
exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

// Central error handler — never leaks stack traces in production
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} is already in use` : "Duplicate value";
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid identifier";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    errors,
  });
};

// Wraps an async controller so rejected promises are forwarded to Express's
// centralized error handler instead of crashing the process.
module.exports = function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};

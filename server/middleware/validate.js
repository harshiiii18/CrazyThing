const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => e.msg);
    return next(new ApiError(400, "Validation failed", errors));
  }
  next();
};

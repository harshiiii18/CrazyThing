const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// POST /api/users/me/request-verification
exports.requestVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.sellerVerification.status === "VERIFIED") {
    throw new ApiError(400, "You're already a verified seller");
  }
  if (user.sellerVerification.status === "PENDING") {
    throw new ApiError(400, "Your verification request is already under review");
  }

  user.sellerVerification.status = "PENDING";
  user.sellerVerification.requestedAt = new Date();
  user.sellerVerification.rejectionReason = undefined;
  await user.save();

  return success(res, { message: "Verification request submitted", data: user.toSafeJSON() });
});
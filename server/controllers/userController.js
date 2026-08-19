const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// PUT /api/users/me — update editable profile fields
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "bio", "location", "avatar"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return success(res, { message: "Profile updated", data: user.toSafeJSON() });
});

// PUT /api/users/me/password — change password (requires current password)
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const match = await user.comparePassword(currentPassword);
  if (!match) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return success(res, { message: "Password updated" });
});

// GET /api/users/:username — public profile view
exports.getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw new ApiError(404, "User not found");

  return success(res, {
    message: "Profile fetched",
    data: {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      sellerVerification: user.sellerVerification,
      ratingAvg: user.ratingAvg,
      ratingCount: user.ratingCount,
      completedSalesCount: user.completedSalesCount,
      createdAt: user.createdAt,
    },
  });
});
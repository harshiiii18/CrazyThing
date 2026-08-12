const crypto = require("crypto");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const { signToken } = require("../utils/token");
const { sendEmail } = require("../services/emailService");

exports.signup = asyncHandler(async (req, res) => {
  const { name, username, email, password, phone } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new ApiError(409, "Email or username is already in use");

  const emailVerifyToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    username,
    email,
    password,
    phone,
    emailVerifyToken,
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your CrazyThing account",
    text: `Welcome to CrazyThing! Verify your email using this token: ${emailVerifyToken}`,
  });

  const token = signToken(user._id);
  return success(res, {
    status: 201,
    message: "Account created",
    data: { user: user.toSafeJSON(), token },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (!user.isActive) throw new ApiError(403, "This account has been deactivated");

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, "Invalid email or password");

  const token = signToken(user._id);
  return success(res, {
    message: "Logged in",
    data: { user: user.toSafeJSON(), token },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  // Stateless JWT — the client discards the token. Included for API completeness
  // and as the place to blacklist a refresh token if that strategy is added later.
  return success(res, { message: "Logged out" });
});

exports.me = asyncHandler(async (req, res) => {
  return success(res, { message: "Current user", data: req.user.toSafeJSON() });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way whether or not the account exists, so the
  // endpoint can't be used to enumerate registered emails.
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Reset your CrazyThing password",
      text: `Use this token to reset your password (valid for 1 hour): ${resetToken}`,
    });
  }

  return success(res, { message: "If that email exists, a reset link has been sent" });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return success(res, { message: "Password reset successful" });
});

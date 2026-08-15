const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// GET /api/admin/analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, pendingVerifications, revenueAgg] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ status: { $ne: "DELETED" } }),
      Order.countDocuments(),
      User.countDocuments({ "sellerVerification.status": "PENDING" }),
      Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

  return success(res, {
    message: "Analytics fetched",
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingVerifications,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});

// GET /api/admin/users
exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return success(res, { message: "Users fetched", data: users.map((u) => u.toSafeJSON()) });
});

// PATCH /api/admin/users/:id/status  { isActive: boolean }
exports.setUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "ADMIN") throw new ApiError(400, "Cannot suspend another admin");

  user.isActive = isActive;
  await user.save();
  return success(res, { message: isActive ? "User activated" : "User suspended", data: user.toSafeJSON() });
});

// PATCH /api/admin/users/:id/verification  { status: "VERIFIED" | "REJECTED", rejectionReason? }
exports.setSellerVerification = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  if (!["VERIFIED", "REJECTED", "NOT_VERIFIED"].includes(status)) {
    throw new ApiError(400, "Invalid verification status");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.sellerVerification.status = status;
  user.sellerVerification.reviewedAt = new Date();
  if (status === "REJECTED") user.sellerVerification.rejectionReason = rejectionReason;
  await user.save();

  return success(res, { message: "Verification updated", data: user.toSafeJSON() });
});

// GET /api/admin/products
exports.listAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: { $ne: "DELETED" } })
    .populate("seller", "name username email")
    .sort({ createdAt: -1 });
  return success(res, { message: "Products fetched", data: products });
});

// PATCH /api/admin/products/:id/status  { status }
exports.setProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["ACTIVE", "PAUSED", "SOLD_OUT", "REJECTED", "DELETED"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status");

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  product.status = status;
  await product.save();
  return success(res, { message: "Product status updated", data: product });
});
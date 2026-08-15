const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const REVIEWABLE_STATUSES = ["DELIVERED", "COMPLETED"];

async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { ratingAvg: avg, ratingCount: count });
}

async function recalcSellerRating(sellerId) {
  const stats = await Review.aggregate([
    { $match: { seller: sellerId } },
    { $group: { _id: "$seller", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await User.findByIdAndUpdate(sellerId, { ratingAvg: avg, ratingCount: count });
}

// POST /api/reviews  { orderId, productId, rating, comment, images }
exports.createReview = asyncHandler(async (req, res) => {
  const { orderId, productId, rating, comment, images } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only review your own orders");
  }
  if (!REVIEWABLE_STATUSES.includes(order.status)) {
    throw new ApiError(400, "You can only review an order after it's delivered");
  }

  const item = order.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(400, "This product is not part of that order");

  const existing = await Review.findOne({ order: orderId, product: productId });
  if (existing) throw new ApiError(409, "You've already reviewed this item");

  const review = await Review.create({
    order: orderId,
    product: productId,
    reviewer: req.user._id,
    seller: item.seller,
    rating,
    comment,
    images,
  });

  await Promise.all([recalcProductRating(review.product), recalcSellerRating(review.seller)]);

  return success(res, { status: 201, message: "Review submitted", data: review });
});

// GET /api/reviews/product/:productId — public
exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("reviewer", "name avatar")
    .sort({ createdAt: -1 });
  return success(res, { message: "Reviews fetched", data: reviews });
});

// GET /api/reviews/order/:orderId — buyer checks which items they've already reviewed
exports.getOrderReviews = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You don't have access to this order");
  }

  const reviews = await Review.find({ order: req.params.orderId });
  return success(res, { message: "Order reviews fetched", data: reviews });
});
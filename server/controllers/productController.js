const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

// GET /api/products — public browse/search with filters
exports.listProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    condition,
    location,
    verifiedOnly,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { status: "ACTIVE" };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (condition) filter.condition = condition;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let query = Product.find(filter).populate("seller", "name username avatar sellerVerification ratingAvg");
  if (verifiedOnly === "true") {
    query = query.populate({
      path: "seller",
      match: { "sellerVerification.status": "VERIFIED" },
    });
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { views: -1 },
  };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Number(limit));

  const [items, total] = await Promise.all([
    query
      .sort(sortMap[sort] || sortMap.newest)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return success(res, {
    message: "Products fetched",
    data: verifiedOnly === "true" ? items.filter((p) => p.seller) : items,
    meta: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name username avatar sellerVerification ratingAvg ratingCount completedSalesCount createdAt"
  );
  if (!product || product.status === "DELETED") throw new ApiError(404, "Product not found");

  product.views += 1;
  await product.save();

  return success(res, { message: "Product fetched", data: product });
});

// GET /api/products/:id/contact-seller — protected, so seller contact info
// is only exposed to logged-in buyers, not scraped from the public listing.
exports.getSellerContact = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name username email phone"
  );
  if (!product) throw new ApiError(404, "Product not found");

  return success(res, {
    message: "Seller contact fetched",
    data: {
      name: product.seller.name,
      username: product.seller.username,
      email: product.seller.email,
      phone: product.seller.phone || null,
    },
  });
});

// POST /api/products — seller creates a listing
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user._id });
  return success(res, { status: 201, message: "Listing created", data: product });
});

// PUT /api/products/:id — owner or admin only
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You can only edit your own listings");
  }

  Object.assign(product, req.body);
  await product.save();
  return success(res, { message: "Listing updated", data: product });
});

// DELETE /api/products/:id — soft delete
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You can only delete your own listings");
  }

  product.status = "DELETED";
  await product.save();
  return success(res, { message: "Listing deleted" });
});

// PATCH /api/products/:id/status — pause/resume/mark unavailable
exports.updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["ACTIVE", "PAUSED", "SOLD_OUT"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status for this action");

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You can only update your own listings");
  }

  product.status = status;
  await product.save();
  return success(res, { message: "Status updated", data: product });
});

// GET /api/products/mine — seller's own listings
exports.myProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, status: { $ne: "DELETED" } }).sort({
    createdAt: -1,
  });
  return success(res, { message: "Your listings", data: products });
});

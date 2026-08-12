const Wishlist = require("../models/Wishlist");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  return success(res, { message: "Wishlist fetched", data: wishlist.products });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

  const idx = wishlist.products.findIndex((p) => p.toString() === productId);
  let added;
  if (idx >= 0) {
    wishlist.products.splice(idx, 1);
    added = false;
  } else {
    wishlist.products.push(productId);
    added = true;
  }
  await wishlist.save();

  return success(res, { message: added ? "Added to wishlist" : "Removed from wishlist", data: { added } });
});

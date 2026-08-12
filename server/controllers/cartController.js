const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

async function priceCart(cart) {
  const populated = await cart.populate({
    path: "items.product",
    populate: { path: "seller", select: "name username sellerVerification" },
  });
  const items = populated.items
    .filter((i) => i.product && i.product.status === "ACTIVE") // drop stale/removed products
    .map((i) => ({
      product: i.product,
      quantity: i.quantity,
      lineTotal: i.product.price * i.quantity,
    }));
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, subtotal };
}

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const priced = await priceCart(cart);
  return success(res, { message: "Cart fetched", data: priced });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== "ACTIVE") throw new ApiError(404, "Product not available");
  if (product.quantity < quantity) throw new ApiError(400, "Not enough stock available");

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity, priceAtAdd: product.price });
  }
  await cart.save();

  const priced = await priceCart(cart);
  return success(res, { message: "Added to cart", data: priced });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw new ApiError(404, "Item not in cart");

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }
  await cart.save();

  const priced = await priceCart(cart);
  return success(res, { message: "Cart updated", data: priced });
});

exports.removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();

  const priced = await priceCart(cart);
  return success(res, { message: "Item removed", data: priced });
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { upsert: true });
  return success(res, { message: "Cart cleared", data: { items: [], subtotal: 0 } });
});

exports.priceCart = priceCart;

const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const paymentService = require("../services/paymentService");
const { priceCart } = require("./cartController");

const SHIPPING_FEE = 0; // flat-rate placeholder; swap for a real shipping calc later

// POST /api/orders — create order from the buyer's cart, then open a payment order
exports.createOrder = asyncHandler(async (req, res) => {
  const { addressId, notes } = req.body;

  const address = await Address.findOne({ _id: addressId, user: req.user._id });
  if (!address) throw new ApiError(400, "Select a valid shipping address");

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty");

  // Server is the only source of truth for prices and stock — never trust the client.
  const { items: pricedItems, subtotal } = await priceCart(cart);
  if (pricedItems.length === 0) throw new ApiError(400, "No items in your cart are still available");

  for (const item of pricedItems) {
    if (item.product.quantity < item.quantity) {
      throw new ApiError(400, `${item.product.title} no longer has enough stock`);
    }
  }

  const total = subtotal + SHIPPING_FEE;

  const order = await Order.create({
    buyer: req.user._id,
    items: pricedItems.map((i) => ({
      product: i.product._id,
      seller: i.product.seller,
      title: i.product.title,
      image: i.product.images?.[0]?.url,
      price: i.product.price,
      quantity: i.quantity,
    })),
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    subtotal,
    shippingFee: SHIPPING_FEE,
    total,
    notes,
    statusHistory: [{ status: "PENDING_PAYMENT", note: "Order created" }],
  });

  const razorpayOrder = await paymentService.createOrder({
    amount: total,
    receipt: order._id.toString(),
  });

  await Payment.create({
    order: order._id,
    buyer: req.user._id,
    razorpayOrderId: razorpayOrder.id,
    amount: total,
    isMock: razorpayOrder.isMock,
  });

  return success(res, {
    status: 201,
    message: "Order created — proceed to payment",
    data: {
      order,
      razorpayOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
      mockMode: paymentService.isMockMode,
    },
  });
});

// GET /api/orders — buyer's own orders
exports.myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  return success(res, { message: "Orders fetched", data: orders });
});

// GET /api/orders/:id — buyer, an item's seller, or admin may view
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const isBuyer = order.buyer.toString() === req.user._id.toString();
  const isSeller = order.items.some((i) => i.seller.toString() === req.user._id.toString());
  if (!isBuyer && !isSeller && req.user.role !== "ADMIN") {
    throw new ApiError(403, "You don't have access to this order");
  }

  return success(res, { message: "Order fetched", data: order });
});

// GET /api/orders/seller/mine — orders containing the current seller's items
exports.sellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user._id }).sort({ createdAt: -1 });
  return success(res, { message: "Seller orders fetched", data: orders });
});

// PATCH /api/orders/:id/cancel — buyer cancels before shipment
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only cancel your own orders");
  }
  const cancellable = ["PENDING_PAYMENT", "PAID", "SELLER_CONFIRMATION_PENDING", "CONFIRMED"];
  if (!cancellable.includes(order.status)) {
    throw new ApiError(400, "This order can no longer be cancelled");
  }

  order.pushStatus("CANCELLED", req.body.reason);
  order.cancelReason = req.body.reason;
  await order.save();
  return success(res, { message: "Order cancelled", data: order });
});

// --- Seller-side order management ---

// PATCH /api/orders/:id/seller-action  { action: "accept" | "reject", reason? }
exports.sellerRespond = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const isSeller = order.items.some((i) => i.seller.toString() === req.user._id.toString());
  if (!isSeller) throw new ApiError(403, "You are not a seller on this order");
  if (order.status !== "SELLER_CONFIRMATION_PENDING") {
    throw new ApiError(400, "This order is not awaiting seller confirmation");
  }

  if (action === "accept") {
    order.pushStatus("CONFIRMED", "Seller accepted the order");
  } else if (action === "reject") {
    order.pushStatus("CANCELLED", reason || "Seller rejected the order");
  } else {
    throw new ApiError(400, "Action must be 'accept' or 'reject'");
  }

  await order.save();
  return success(res, { message: "Order updated", data: order });
});

// PATCH /api/orders/:id/pack
exports.markPacked = asyncHandler(async (req, res) => {
  const order = await requireSellerOrder(req);
  if (order.status !== "CONFIRMED") throw new ApiError(400, "Order must be confirmed first");
  order.pushStatus("PACKED");
  await order.save();
  return success(res, { message: "Marked as packed", data: order });
});

// PATCH /api/orders/:id/ship  { courier, trackingNumber, estimatedDelivery }
exports.markShipped = asyncHandler(async (req, res) => {
  const { courier, trackingNumber, estimatedDelivery } = req.body;
  if (!courier || !trackingNumber) {
    throw new ApiError(400, "Courier and tracking number are required");
  }
  const order = await requireSellerOrder(req);
  if (order.status !== "PACKED") throw new ApiError(400, "Order must be packed first");

  order.tracking = {
    courier,
    trackingNumber,
    shippedAt: new Date(),
    estimatedDelivery,
  };
  order.pushStatus("SHIPPED");
  await order.save();
  return success(res, { message: "Marked as shipped", data: order });
});

// PATCH /api/orders/:id/deliver — buyer confirms receipt, or admin/seller marks delivered
// PATCH /api/orders/:id/deliver — buyer confirms receipt
exports.markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only the buyer can confirm delivery");
  }
  if (!["SHIPPED", "OUT_FOR_DELIVERY"].includes(order.status)) {
    throw new ApiError(400, "Order has not been shipped yet");
  }
  order.tracking = order.tracking || {};
  order.tracking.deliveredAt = new Date();
  order.pushStatus("DELIVERED");
  await order.save();
  return success(res, { message: "Marked as delivered", data: order });
});

async function requireSellerOrder(req) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  const isSeller = order.items.some((i) => i.seller.toString() === req.user._id.toString());
  if (!isSeller) throw new ApiError(403, "You are not a seller on this order");
  return order;
}

const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const paymentService = require("../services/paymentService");

// POST /api/payments/verify
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// This is the ONLY place payment success is trusted — the frontend's "payment
// succeeded" callback is never sufficient on its own.
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "This order does not belong to you");
  }

  const payment = await Payment.findOne({ order: order._id, razorpayOrderId: razorpay_order_id });
  if (!payment) throw new ApiError(404, "Payment record not found for this order");

  const isValid = paymentService.verifySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    isMock: payment.isMock,
  });

  if (!isValid) {
    payment.status = "FAILED";
    await payment.save();
    order.paymentStatus = "FAILED";
    await order.save();
    throw new ApiError(400, "Payment verification failed");
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = "PAID";
  await payment.save();

  order.paymentStatus = "PAID";
  order.pushStatus("PAID", "Payment verified");
  order.pushStatus("SELLER_CONFIRMATION_PENDING", "Awaiting seller confirmation");
  await order.save();

  // Decrement stock for each purchased product now that payment is confirmed.
  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } })
    )
  );

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  return success(res, { message: "Payment verified — order confirmed", data: order });
});

// POST /api/payments/:orderId/mark-failed — frontend calls this if the Razorpay modal is dismissed/fails
exports.markFailed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "This order does not belong to you");
  }

  order.paymentStatus = "FAILED";
  await order.save();
  await Payment.findOneAndUpdate({ order: order._id }, { status: "FAILED" });

  return success(res, { message: "Payment marked as failed", data: order });
});

const crypto = require("crypto");
const Razorpay = require("razorpay");

const hasRazorpayCreds = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

const razorpay = hasRazorpayCreds
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

/**
 * Creates a Razorpay order for the given amount (in rupees).
 * Falls back to a clearly-marked mock order when RAZORPAY_KEY_ID/SECRET are
 * not configured, so the checkout flow is testable locally. isMock is
 * persisted on the Payment record — never treat a mock order as a real
 * payment success signal.
 */
exports.createOrder = async ({ amount, receipt }) => {
  if (!razorpay) {
    return {
      id: `mock_order_${crypto.randomBytes(8).toString("hex")}`,
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      isMock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt,
  });
  return { ...order, isMock: false };
};

/**
 * Verifies the HMAC-SHA256 signature Razorpay sends back after checkout.
 * In mock mode (no credentials configured), signature verification is
 * skipped and the payment is marked verified only for local development —
 * this path must never run against real money.
 */
exports.verifySignature = ({ orderId, paymentId, signature, isMock }) => {
  if (isMock) return true;
  if (!process.env.RAZORPAY_KEY_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
};

exports.isMockMode = !hasRazorpayCreds;

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000, default: "" },
    images: [{ url: String }],
  },
  { timestamps: true }
);

// One review per product per order — prevents duplicate reviews on the same purchase
reviewSchema.index({ order: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
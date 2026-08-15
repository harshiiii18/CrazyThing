const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    condition: {
      type: String,
      enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR", "USED"],
      required: true,
    },
    location: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 0 },

    brand: String,
    model: String,
    color: String,
    size: String,
    tags: [{ type: String, lowercase: true, trim: true }],
    specifications: { type: Map, of: String },
    deliveryInfo: { type: String, default: "" },

    images: [{ url: String, publicId: String }],

    status: {
      type: String,
      enum: ["DRAFT", "PENDING_APPROVAL", "ACTIVE", "SOLD_OUT", "PAUSED", "REJECTED", "DELETED"],
      default: "ACTIVE",
    },

    views: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    aiGenerated: {
      title: Boolean,
      description: Boolean,
      priceRange: { min: Number, max: Number },
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ seller: 1 });

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    phone: { type: String, trim: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    location: { type: String, default: "" },

    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },

    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    isActive: { type: Boolean, default: true },

    // Seller trust
    sellerVerification: {
      status: {
        type: String,
        enum: ["NOT_VERIFIED", "PENDING", "VERIFIED", "REJECTED"],
        default: "NOT_VERIFIED",
      },
      requestedAt: Date,
      reviewedAt: Date,
      rejectionReason: String,
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedSalesCount: { type: Number, default: 0 },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 10);
  
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerifyToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

module.exports = mongoose.model("User", userSchema);

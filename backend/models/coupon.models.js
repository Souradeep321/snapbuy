import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  expiry: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false // for user-specific coupons
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
}, { timestamps: true });


export const Coupon = mongoose.model("Coupon", couponSchema);

import { Coupon } from "../models/coupon.models.js";

export const generateCouponForUser = async (userId, totalAmount) => {
  // Only generate if order amount is above ₹5000
  if (totalAmount < 5000) return null;

  // Check if the user already has a valid, unused, non-expired coupon
  const existingCoupon = await Coupon.findOne({
    userId,
    isUsed: false,
    isActive: true,
    expiry: { $gt: new Date() } // not expired
  });

  if (existingCoupon) {
    return existingCoupon;
  }

  // Generate a new coupon code
  const code = `SAVE${Math.floor(100000 + Math.random() * 900000)}`; // 6-digit

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // valid for 7 days

  // Create the coupon
  const newCoupon = await Coupon.create({
    code,
    discountPercentage: 10,
    expiry,
    userId,
    minPurchase: 5000,
    isUsed: false,
    isActive: true,
  });

  return newCoupon;
};

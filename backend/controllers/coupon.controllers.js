import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Coupon } from "../models/coupon.models.js";


const getMyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const coupon = await Coupon.findOne({ userId });

  if (!coupon) {
    throw new ApiError(404, "No coupon found for this user");
  }

  return res.status(200).json(new ApiResponse(200, coupon, "Coupon fetched successfully"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});

  if (!coupons || coupons.length === 0) {
    throw new ApiError(404, "No coupons found");
  }

  return res.status(200).json(new ApiResponse(200, coupons, "All coupons fetched successfully"));
});


export {
  getMyCoupon,
  getAllCoupons,
};
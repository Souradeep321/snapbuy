import { Router } from "express";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllCoupons,
  getMyCoupon,
} from "../controllers/coupon.controllers.js";

const router = Router();

// 🔐 Admin Routes
router.get("/", protectedRoute, adminRoute, getAllCoupons); // List all coupons

// 👤 User Routes
router.get("/mine", protectedRoute, getMyCoupon); // Get user's personal and global coupons


export default router;

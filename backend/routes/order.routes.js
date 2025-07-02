import { Router } from "express";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  orderStatusUpdate
} from "../controllers/order.controllers.js";

const router = Router();

// Razorpay Flow
router.post("/create-payment-order", protectedRoute, createRazorpayOrder);  // Step 1: Create Razorpay Order
router.post("/verify", protectedRoute, verifyPaymentAndCreateOrder);        // Step 2: Verify & Save Order

// User Order History
router.get("/my", protectedRoute, getMyOrders);
router.get("/:orderId", protectedRoute, getOrderById);

// Admin
router.get("/", protectedRoute, adminRoute, getAllOrders);
router.patch("/:orderId/status", protectedRoute, adminRoute, orderStatusUpdate);

export default router;


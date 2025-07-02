import { Cart } from "../models/cart.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";

import { generateCouponForUser } from "../utils/generateCoupons.js";
import { Order } from "../models/order.models.js";
import { Notification } from "../models/notification.models.js";
import { User } from "../models/user.models.js";
import { Coupon } from "../models/coupon.models.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // Get cart items from DB (or req.body)
    const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");

    if (!cart || cart.cartItems.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const totalAmount = cart.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const options = {
        amount: totalAmount * 100, // in paisa
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) throw new ApiError(500, "Failed to create Razorpay order");

    res.status(200).json(new ApiResponse(200, order, "Razorpay order created"));
});

const verifyPaymentAndCreateOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        shippingAddress,
        couponCode, // ✅ using couponCode instead of couponId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !shippingAddress
    ) {
        throw new ApiError(400, "All payment and shipping details are required");
    }

    // 1. ✅ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Invalid payment signature");
    }

    // 2. ✅ Fetch cart
    const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");
    if (!cart || cart.cartItems.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // 3. ✅ Calculate total amount
    const totalAmount = cart.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    // 4. ✅ Apply coupon (if valid)
    let finalAmount = totalAmount;
    let appliedCoupon = null;

    if (couponCode) {
        const existingCoupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            userId,
            isUsed: false,
            isActive: true,
            expiry: { $gt: new Date() },
        });

        if (!existingCoupon) {
            throw new ApiError(400, "Invalid or expired coupon");
        }

        if (existingCoupon.minPurchase && totalAmount < existingCoupon.minPurchase) {
            throw new ApiError(400, `Minimum purchase ₹${existingCoupon.minPurchase} required`);
        }

        const discount = (existingCoupon.discountPercentage / 100) * totalAmount;
        finalAmount = totalAmount - discount;
        appliedCoupon = existingCoupon;
    }

    // 5. ✅ Create Order
    const order = await Order.create({
        user: userId,
        orderItems: cart.cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
        })),
        shippingAddress,
        paymentInfo: {
            method: "razorpay",
            status: "paid",
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paidAt: new Date(),
        },
        isPaid: true,
        totalPrice: finalAmount,
        orderStatus: "processing",
        coupon: appliedCoupon?._id || null, // store coupon ref if used
    });

    // 6. ✅ Clear Cart
    cart.cartItems = [];
    await cart.save();

    // 7. ✅ Mark coupon as used (or delete)
    if (appliedCoupon) {
        await Coupon.deleteOne({ _id: appliedCoupon?._id });
    }

    // 8. ✅ Generate new coupon if order > ₹5000
    if (finalAmount >= 5000) {
        await generateCouponForUser(userId, finalAmount);
    }

    // 9. ✅ Notify Admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
        await Notification.create({
            recipient: admin._id,
            sender: userId,
            type: "order",
            message: `New order placed by ${req.user?.username} (Order ID: ${order._id})`,
        });
    }

    res.status(201).json(new ApiResponse(201, order, "Payment verified and order created"));
});

const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orders = await Order.find({ user: userId })
        .populate({
            path: "orderItems.product",
            select: "name price coverImage"
        }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found for this user");
    }

    res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    const order = await Order.findOne({ _id: orderId, user: userId })
        .populate("orderItems.product");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully"));
});

// Admin can fetch all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate({
            path: "orderItems.product",
            select: "name price coverImage"
        })
        .populate("user", "username email") // Optional: show user info
        .sort({ createdAt: -1 });


    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found");
    }

    res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const orderStatusUpdate = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    if (status === "delivered") {
        order.deliveredAt = new Date();
    }

    await order.save();

    const user = await User.findById(order.user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await Notification.create({
        recipient: user._id,
        sender: req.user?._id,
        type: "order",
        message: `Your order (ID: ${order._id}) status has been updated to "${order.orderStatus}" `,
    });

    res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});



export {
    createRazorpayOrder,
    verifyPaymentAndCreateOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    orderStatusUpdate
};






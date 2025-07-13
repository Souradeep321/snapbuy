import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                required: true,
            },
            size: {
                type: String,
                enum: ["S", "M", "L", "XL"],
                default: "M",
                required: true,
            },
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            lowercase: true,
            trim: true,
        },
        phone: { type: String, required: true, match: /^\d{10}$/ },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentInfo: {
        method: { type: String, default: "razorpay" }, // or "COD"
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        razorpay_order_id: {
            type: String,
            required: true,
            unique: true, // Ensure each order has a unique Razorpay order ID
        },
        razorpay_payment_id: {
            type: String,
            required: false, // Optional, can be used for verification
            unique: true, // Ensure each payment ID is unique
        },
        razorpay_signature: {
            type: String,
            required: false, // Optional, can be used for verification
            unique: true, // Ensure each signature is unique
        },
        paidAt: Date,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        required: false,
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing",
    },
    deliveredAt: Date, // Optional — remove this if you don't plan to track delivery timestamp
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);

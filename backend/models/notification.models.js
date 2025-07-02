import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User", // the user who made the order
        required: false,
    },
    type: {
        type: String,
        enum: ["order", "coupon", "alert", "custom"],
        default: "custom",
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);

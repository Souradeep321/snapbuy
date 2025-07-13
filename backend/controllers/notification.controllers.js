import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.models.js";

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sender", "username email")
        .exec();

    if (!notifications) {
        throw new ApiError(404, "No notifications found");
    }

    return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

const markAsRead = asyncHandler(async (req, res) => {
    const { id: notificationId } = req.params;
    const notification = await Notification.findOne({ _id: notificationId, recipient: req.user._id });
    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }
    notification.isRead = true;
    await notification.save();
    return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read successfully"));
});


const deleteNotification = asyncHandler(async (req, res) => {
    const { id: notificationId } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: notificationId, recipient: req.user._id });

    if (!notification) throw new ApiError(404, "Notification not found");

    return res.status(200).json(new ApiResponse(200, null, "Notification deleted successfully"));
});

const deleteAllNotification = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const notification = await Notification.find({ recipient: userId });
    if (notification.length === 0) {
        throw new ApiError(404, "No notifications found");
    }
    // Delete all notifications for the user
    const result = await Notification.deleteMany({ recipient: userId });
   
    return res.status(200).json(new ApiResponse(200, result, "All notifications deleted successfully"));
});

export {
    getNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotification
}
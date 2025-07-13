import { Router } from "express";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotification
} from "../controllers/notification.controllers.js";

const router = Router();

router.get("/", protectedRoute, getNotifications); // Admin/user sees their notifications
router.patch("/:id/read", protectedRoute, markAsRead); // Mark notification as read
router.delete("/:id", protectedRoute, deleteNotification); // Optional: delete notification
router.delete("/", protectedRoute,  deleteAllNotification); // Admin/user deletes a notification

export default router;

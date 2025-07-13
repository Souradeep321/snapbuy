import { Router } from "express";
import { avatarUpload, getProfile, loginUser, logout, refreshAccessToken, registerUser, changeCurrentPassword } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/logout").post(logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(protectedRoute, getProfile);
router.route("/update-profile").patch(protectedRoute, changeCurrentPassword);
router.route("/avatar").patch(protectedRoute, upload.single("avatar"), avatarUpload);

export default router


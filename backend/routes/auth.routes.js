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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODRkYmJhM2RlMGVjMWU3YzNiYWU0NDgiLCJlbWFpbCI6InNvdXJhZGVlcGhhenJhOTNAZ21haWwuY29tIiwiaWF0IjoxNzUxNzM1MDc2LCJleHAiOjE3NTE3MzUxMzZ9.eaeUmVUk83bAMgWZF_OwDEErHrpn4sBfc4fl9w6hClU

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODRkYmJhM2RlMGVjMWU3YzNiYWU0NDgiLCJlbWFpbCI6InNvdXJhZGVlcGhhenJhOTNAZ21haWwuY29tIiwiaWF0IjoxNzUxNzM1MTA1LCJleHAiOjE3NTE3MzUxNjV9._xvWq3RVuLihM0Mw2X4HXFKatJ2e10Tv7jkbFahDAfE
import { Router } from "express";
import { adminRoute, protectedRoute } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controllers.js";

const router = Router();

router.route("/").get(protectedRoute,adminRoute,getAnalytics);

export default router;
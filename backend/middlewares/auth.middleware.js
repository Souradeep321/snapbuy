import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protectedRoute = asyncHandler(async (req, _, next) => {
    // Try cookies first, then Authorization header
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized");

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if (!user) throw new ApiError(401, "Unauthorized");

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

export const adminRoute = asyncHandler(async (req, _, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not logged in");
    }

    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Forbidden: Admin access only");
    }

    next();
});

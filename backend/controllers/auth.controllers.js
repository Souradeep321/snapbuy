import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, `Token generation error: ${error.message}`);
    }
}

const setCookies = (res, accessToken, refreshToken) => {
    // authController.js (setCookies)
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax", // More flexible than strict
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // should be false for localhost
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) throw new ApiError(400, "Please enter all fields");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    try {
        const user = await User.create({
            username,
            email,
            password,
        })

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        setCookies(res, accessToken, refreshToken);

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
    } catch (error) {
        console.log("Error creating user", error);
        throw new ApiError(500, "Failed to create user")
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) throw new ApiError(400, "Please enter all fields");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    setCookies(res, accessToken, refreshToken);

    res.status(200).json(new ApiResponse(200, loggedInUser, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logout successful"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) throw new ApiError(401, "Invalid refresh token");

        // Token rotation - detect reuse
        if (incomingRefreshToken !== user?.refreshToken) {
            user.refreshToken = undefined;
            await user.save({ validateBeforeSave: false });
            throw new ApiError(401, "Refresh token was reused");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        setCookies(res, accessToken, newRefreshToken);

        res.status(200).json(
            new ApiResponse(200, { accessToken }, "Access token refreshed")
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) throw new ApiError(401, "Current password is incorrect");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});


const avatarUpload = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Please upload an avatar image");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url || !avatar?.public_id)
        throw new ApiError(500, "Failed to upload avatar image");

    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    // Delete old image from Cloudinary if exists
    if (user.avatar?.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
    }

    user.avatar = {
        url: avatar.url,
        public_id: avatar.public_id,
    };
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar uploaded successfully"));
});

export {
    registerUser,
    loginUser,
    getProfile,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    avatarUpload
}




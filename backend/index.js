import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db/connection.js";

dotenv.config({
    path: "backend/.env"
});

const app = express();
const port = process.env.PORT || 4000;

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// common middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static("public"))

// import routes 
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

// routes
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


connectDB().
    then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        })
    }).catch((error) => {
        console.log(error);
        process.exit(1);
    })
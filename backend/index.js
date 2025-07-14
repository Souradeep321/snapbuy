import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import path from "path";

import connectDB from "./db/connection.js";

dotenv.config({
    path: "backend/.env"
});

const app = express();
const port = process.env.PORT || 4000;

const __dirname = path.resolve();

app.use(cookieParser());
app.use(compression());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);
// common middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))

// import routes 
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
// import couponRoutes from "./routes/coupon.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

// routes
app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/notifications", notificationRoutes);
// app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error middleware caught:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


connectDB().
    then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        })
    }).catch((error) => {
        console.log(error);
        process.exit(1);
    })
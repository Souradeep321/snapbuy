import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAnalytics = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
        { $match: { orderStatus: "processing" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalSales = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const monthlySales = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                total: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    // const topProducts = await Order.aggregate([
    //     { $unwind: "$orderItems" },  // Step 1: Break the array into individual items

    //     {
    //         $group: {                   // Step 2: Group by product ID
    //             _id: "$orderItems.product",
    //             totalSold: { $sum: "$orderItems.quantity" }  // Count how many units sold
    //         }
    //     },

    //     {
    //         $lookup: {                  // Step 3: Join with Product collection to get product details
    //             from: "products",
    //             localField: "_id",        // Our current `_id` is productId
    //             foreignField: "_id",
    //             as: "product"
    //         }
    //     },

    //     { $unwind: "$product" },     // Step 4: Flatten the joined product info

    //     {
    //         $project: {                 // Step 5: Choose the fields to return
    //             _id: 0,
    //             productId: "$product._id",
    //             name: "$product.name",
    //             coverImage: "$product.coverImage",
    //             totalSold: 1
    //         }
    //     },

    //     { $sort: { totalSold: -1 } }, // Step 6: Sort by most sold
    //     { $limit: 5 }                 // Step 7: Return only top 5 products
    // ]);

    const topProducts = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: "$orderItems.product",
                totalSold: { $sum: "$orderItems.quantity" }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products", // collection name (not model name)
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $unwind: "$productInfo"
        },
        {
            $project: {
                _id: 1,
                totalSold: 1,
                name: "$productInfo.name",
                coverImage: "$productInfo.coverImage"
            }
        }
    ]);



    const newUsers = await User.aggregate([
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    const dailySales = await Order.aggregate([
        {
            $match: { isPaid: true }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                },
                total: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1
            }
        }
    ]);


    const orderStatusBreakdown = await Order.aggregate([
        {
            $group: {
                _id: "$orderStatus",
                count: { $sum: 1 }
            }
        }
    ]);



    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalSales: totalSales[0]?.totalRevenue || 0,
            monthlySales,
            topProducts,
            newUsers,
            dailySales,
            orderStatusBreakdown
        }, "Analytics fetched successfully")
    );
});



export { getAnalytics };
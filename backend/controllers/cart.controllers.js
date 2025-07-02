import { Product } from "../models/product.models.js";
import { Cart } from "../models/cart.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json(new ApiError(401, [], "User not authenticated"));
    }

    const cart = await Cart.findOne({ user: userId })
        .populate("cartItems.product"); // Load full product (incl. virtuals)

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return res.status(404).json(new ApiError(404, [], "Cart is empty"));
    }

    const cartItems = cart.cartItems.map((item) => {
        const product = item.product;

        return {
            _id: item._id,
            quantity: item.quantity,
            totalPrice: item.quantity * product.price,
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                coverImage: product.coverImage?.url || null,
                category: product.category,
                subCategory: product.subCategory,
                description: product.description,
            }
        };
    });
    res.status(200).json(new ApiResponse(200, cartItems, "Cart items retrieved successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (qty > product.countInStock) {
        throw new ApiError(400, `Only ${product.countInStock} units available in stock`);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // 🆕 Create new cart
        cart = await Cart.create({
            user: userId,
            cartItems: [{ product: productId, quantity: qty }]
        });
    } else {
        // 🔁 Check if product already in cart
        const existingItem = cart.cartItems.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + qty;

            if (newQuantity > product.countInStock) {
                throw new ApiError(
                    400,
                    `Cannot add ${qty} more. Only ${product.countInStock - existingItem.quantity} units left.`
                );
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.cartItems.push({ product: productId, quantity: qty });
        }

        await cart.save();
    }

    res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));
});

const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user?._id;
    if (!productId) throw new ApiError(400, "Product ID is required");

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) throw new ApiError(404, "Product not found in cart");

    cart.cartItems.splice(itemIndex, 1);
    if (cart.cartItems.length === 0) {
        // If cart is empty, remove the cart document
        await Cart.deleteOne({ _id: cart._id });
        return res.status(200).json(new ApiResponse(200, [], "Cart is now empty"));
    }
    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, "Product removed from cart"));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;

    if (!productId || quantity === undefined) {
        throw new ApiError(400, "Product ID and quantity are required");
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
        throw new ApiError(400, "Quantity must be a number and at least 1");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (qty > product.countInStock) {
        throw new ApiError(400, `Only ${product.countInStock} units available in stock`);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.cartItems.find(
        (item) => item.product.toString() === productId
    );

    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart");
    }

    cartItem.quantity = qty;
    await cart.save();

    res.status(200).json(
        new ApiResponse(200, cart, "Cart item quantity updated successfully")
    );
});

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.cartItems = [];
    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export {
    getCartItems,
    addToCart,
    removeCartItem,
    updateCartItemQuantity,
    clearCart
}
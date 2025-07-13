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

    const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
    }


    // Filter out cart items whose product has been deleted (i.e., product === null)
    const validItems = cart.cartItems.filter(item => item.product !== null);

    // If all products are invalid (e.g., deleted), treat cart as empty
    if (validItems.length === 0) {
        return res.status(404).json(new ApiError(404, [], "Cart contains no valid products"));
    }

    const cartItems = validItems.map((item) => {
        const product = item.product;

        return {
            _id: item._id,
            quantity: item.quantity,
            size: item.size,
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
    const { productId, quantity, size } = req.body;

    if (!productId) throw new ApiError(400, "Product ID is required");

    const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;
    const selectedSize = size || "M"; // default to M

    if (!["S", "M", "L", "XL"].includes(selectedSize)) {
        throw new ApiError(400, "Invalid size selected");
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (qty > product.countInStock) {
        throw new ApiError(400, `Only ${product.countInStock} units available`);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            cartItems: [{ product: productId, quantity: qty, size: selectedSize }]
        });
    } else {
        const existingItem = cart.cartItems.find(
            (item) =>
                item.product.toString() === productId &&
                item.size === selectedSize
        );

        if (existingItem) {
            const newQty = existingItem.quantity + qty;

            if (newQty > product.countInStock) {
                throw new ApiError(
                    400,
                    `Only ${product.countInStock - existingItem.quantity} units left for size ${selectedSize}`
                );
            }

            existingItem.quantity = newQty;
        } else {
            cart.cartItems.push({ product: productId, quantity: qty, size: selectedSize });
        }

        await cart.save();
    }

    res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));
});


const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { size } = req.body;
    const userId = req.user?._id;

    if (!productId || !size) {
        throw new ApiError(400, "Product ID and size are required");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex === -1) {
        return res.status(200).json(new ApiResponse(200, [], "Item already removed"));
    }

    cart.cartItems.splice(itemIndex, 1);

    if (cart.cartItems.length === 0) {
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

    //&& item.size === size

    if (!cartItem) {
        throw new ApiError(404, "Product not found in cart");
    }

    cartItem.quantity = qty;
    await cart.save();

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
    }

    res.status(200).json(
        new ApiResponse(200, cart, "Cart item quantity updated successfully")
    );
});

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.cartItems.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "Cart already empty"));
    }

    cart.cartItems = [];
    await cart.save();

    res.status(200).json(new ApiResponse(200, [], "Cart cleared successfully"));
});

export {
    getCartItems,
    addToCart,
    removeCartItem,
    updateCartItemQuantity,
    clearCart
}
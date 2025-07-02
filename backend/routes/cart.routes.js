import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { addToCart, getCartItems, removeCartItem, updateCartItemQuantity, clearCart } from "../controllers/cart.controllers.js";

const router = Router();

router.route("/").get(protectedRoute, getCartItems)
router.route("/").post(protectedRoute, addToCart)
router.delete("/:productId", protectedRoute, removeCartItem);
router.patch("/:productId", protectedRoute, updateCartItemQuantity);
router.delete("/", protectedRoute, clearCart);

export default router;



/*
import { Router } from "express";
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controllers.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// 🛒 GET current user's cart
router.get("/", protectedRoute, getCartItems);

// ➕ Add product to cart
router.post("/", protectedRoute, addToCart);

// 🔁 Update quantity of a cart item
router.patch("/:productId", protectedRoute, updateCartItemQuantity);

// ❌ Remove product from cart
router.delete("/:productId", protectedRoute, removeCartItem);

// 🚫 Clear entire cart
router.delete("/", protectedRoute, clearCart);

export default router;
*/
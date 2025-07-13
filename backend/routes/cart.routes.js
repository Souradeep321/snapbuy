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




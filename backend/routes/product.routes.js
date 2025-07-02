import { Router } from "express";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getProductBySubCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controllers.js";

const router = Router();

router.route("/").get(protectedRoute, adminRoute, getAllProducts)
router.route("/recommendations").get(getRecommendedProducts)
router.route("/featured").get(getFeaturedProducts)
router.route("/category/:category").get(getProductByCategory)
router.route("/:category/:subCategory").get(getProductBySubCategory)


router.route("/").post(
    protectedRoute,
    adminRoute,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "additionalImages", maxCount: 5 },
    ]),
    createProduct
);
router.route("/:id").patch(protectedRoute, adminRoute, toggleFeaturedProduct)
router.route("/:id").delete(protectedRoute, adminRoute, deleteProduct)

export default router;
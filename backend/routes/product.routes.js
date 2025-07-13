import { Router } from "express";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    toggleFeaturedProduct,
    getRecommendedProducts,
    getFeaturedProducts,
    getProductBygender,
    getProductBygenderCategory,
    getProductByCategory,
    getProductBygenderCategorySubCategory,
    getProductByCategorySubCategory,
    getProductById,
    addProductReview,
    editProductReview,
    deleteProductReview

} from "../controllers/product.controllers.js";

const router = Router();

router.route("/").get(protectedRoute, adminRoute, getAllProducts)
router.route("/recommendations").get(getRecommendedProducts)
router.route("/featured").get(getFeaturedProducts)

// Make routes explicit
router.get("/gender/:gender", getProductBygender);
router.get("/gender/:gender/category/:category/sub/:subCategory", getProductBygenderCategorySubCategory);
router.get("/category/:category/sub/:subCategory", getProductByCategorySubCategory);
router.get("/gender/:gender/category/:category", getProductBygenderCategory);
router.get("/category/:category", getProductByCategory);

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

router.get("/:id", getProductById);
router.post("/:productId/add-review", protectedRoute, addProductReview);
router.put("/:productId/edit-review", protectedRoute, editProductReview);
router.delete("/:productId/delete-review", protectedRoute, deleteProductReview);



export default router;
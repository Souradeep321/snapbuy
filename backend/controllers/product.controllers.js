import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, subCategory, gender, countInStock } = req.body;

    if (!name || !description || !price || !category || !subCategory || !countInStock) {
        throw new ApiError(400, "Please fill all the fields");
    }

    if (
        !req.files ||
        !req.files.coverImage ||
        req.files.coverImage.length === 0
    ) {
        throw new ApiError(400, "Cover image is required");
    }

    const publicIds = [];

    try {
        // Upload cover image
        const coverImageUpload = await uploadOnCloudinary(
            req.files.coverImage[0].path
        );

        if (!coverImageUpload) {
            throw new ApiError(400, "Cover image upload failed");
        }

        const coverImage = {
            url: coverImageUpload.secure_url,
            public_id: coverImageUpload.public_id,
        };

        publicIds.push(coverImage.public_id);

        // Upload additional images
        const additionalImages = [];

        if (req.files.additionalImages && req.files.additionalImages.length > 0) {
            for (const file of req.files.additionalImages) {
                const result = await uploadOnCloudinary(file.path);
                if (result) {
                    additionalImages.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                    publicIds.push(result.public_id);
                }
            }
        }

        // Save product to DB
        const product = await Product.create({
            name,
            description,
            price,
            gender,
            category,
            subCategory,
            coverImage,
            additionalImages,
            countInStock,
        });

        res.status(201).json(
            new ApiResponse(201, product, "Product created successfully")
        );
    } catch (error) {
        // Cleanup: delete uploaded images if DB save fails
        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(id => deleteFromCloudinary(id)));
        }

        throw new ApiError(500, `Product creation failed: ${error.message}`);
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(404, "No products found");
    }

    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
})

const toggleFeaturedProduct = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    try {
        const publicIdsToDelete = [];

        // Add cover image public_id
        if (product.coverImage?.public_id) {
            publicIdsToDelete.push(product.coverImage.public_id);
        }

        // Add additional images public_ids
        if (product.additionalImages && product.additionalImages.length > 0) {
            product.additionalImages.forEach((img) => {
                if (img?.public_id) publicIdsToDelete.push(img.public_id);
            });
        }

        // Delete all images from Cloudinary
        await Promise.all(
            publicIdsToDelete.map((publicId) => deleteFromCloudinary(publicId))
        );

        // Delete product from DB
        await Product.findByIdAndDelete(productId);

        res
            .status(200)
            .json(new ApiResponse(200, null, "Product deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to delete product: " + error.message);
    }
});

const getRecommendedProducts = asyncHandler(async (req, res) => {
    const randomProducts = await Product.aggregate([
        { $match: { isFeatured: true } },
        { $sample: { size: 5 } }
    ]);

    res.status(200).json(
        new ApiResponse(200, randomProducts, "Random products fetched as recommendations")
    );
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
    const featuredProducts = await Product.find({ isFeatured: true }).sort({ createdAt: -1 });

    if (!featuredProducts || featuredProducts.length === 0) {
        throw new ApiError(404, "No featured products found");
    }

    res.status(200).json(new ApiResponse(200, featuredProducts, "Featured products fetched successfully"));
});

const getProductByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    const products = await Product.find({ category }).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(404, `No products found in category: ${category}`);
    }

    res.status(200).json(new ApiResponse(200, products, `Products in category ${category} fetched successfully`));
});

const getProductBySubCategory = asyncHandler(async (req, res) => {
    const { category, subCategory } = req.params;

    if (!category || !subCategory) {
        throw new ApiError(400, "Both category and sub-category are required");
    }

    const products = await Product.find({ category, subCategory }).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(404, `No products found in category: ${category} and sub-category: ${subCategory}`);
    }

    res.status(200).json(new ApiResponse(200, products, `Products in category ${category} and sub-category ${subCategory} fetched successfully`));
})


export {
    createProduct,
    getAllProducts,
    toggleFeaturedProduct,
    deleteProduct,
    getRecommendedProducts,
    getFeaturedProducts,
    getProductByCategory,
    getProductBySubCategory
};


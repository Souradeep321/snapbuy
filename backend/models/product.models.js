import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter a product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter a product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter a product price"],
        default: 0
    },
    gender: {
        type: String,
        enum: ["male", "female", "unisex"],
        default: "unisex"
    },
    category: {
        type: String,
        required: [true, "Please enter a product category"],
        trim: true,
        lowercase: true,
    },
    subCategory: {
        type: String,
        required: [true, "Please enter a product sub-category"],
        trim: true,
        lowercase: true,
    },
    coverImage: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    additionalImages: [
        {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        }
    ],
    countInStock: {
        type: Number,
        required: [true, "Please enter a product stock"],
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    ratings: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"]
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User"
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true })

function formatSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-');        // Replace spaces with dashes
}

productSchema.pre("save", function (next) {
    if (this.isModified("category")) {
        this.category = formatSlug(this.category);
    }
    if (this.isModified("subCategory")) {
        this.subCategory = formatSlug(this.subCategory);
    }
    next();
});


export const Product = mongoose.model("Product", productSchema)
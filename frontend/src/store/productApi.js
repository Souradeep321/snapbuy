import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-hot-toast'
import { baseQueryWithReauth } from './customBaseQuery'



export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        // ...your endpoints (no change needed here) 
        getAllProducts: builder.query({
            query: () => 'products',
            providesTags: ['Products'],
        }),
        getProducts: builder.query({
            query: ({ gender, category, subCategory }) => {
                if (gender && category && subCategory) {
                    return `products/gender/${gender}/category/${category}/sub/${subCategory}`;
                } else if (gender && category) {
                    return `products/gender/${gender}/category/${category}`;
                } else if (gender) {
                    return `products/gender/${gender}`;
                } else if (category && subCategory) {
                    return `products/category/${category}/sub/${subCategory}`;
                } else if (category) {
                    return `products/category/${category}`;
                } else {
                    return `products`;
                }
            },
        }),
        recommendedProducts: builder.query({
            query: () => ({
                url: '/products/recommendations',
                method: 'GET',
            }),
            providesTags: ['Products'],
        }),
        featuredProducts: builder.query({
            query: () => ({
                url: '/products/featured',
                method: 'GET',
            }),
            providesTags: ['Products'],
        }),
        createProducts: builder.mutation({
            query: (product) => ({
                url: '/products',
                method: 'POST',
                body: product,
                formData: true,
            }),
            invalidatesTags: ['Products'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const toastId = toast.loading('Adding product...');

                // Optimistically add a fake product to the product list
                const tempId = `temp-${Date.now()}`;
                const patchResult = dispatch(
                    productsApi.util.updateQueryData('getAllProducts', undefined, (draft) => {
                        if (Array.isArray(draft?.data)) {
                            draft.data.push({
                                _id: tempId,
                                ...arg,
                                price: Number(arg.get('price')),
                                countInStock: Number(arg.get('countInStock')),
                                isFeatured: false,
                                createdAt: new Date().toISOString(),
                            });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                    toast.success('Product added successfully!', { id: toastId });
                } catch {
                    toast.error('Failed to add product', { id: toastId });
                    patchResult.undo();
                }
            },
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const toastId = toast.loading("Deleting product...");

                const patchResult = dispatch(
                    productsApi.util.updateQueryData('getAllProducts', undefined, (draft) => {
                        return draft.filter((product) => product._id !== id);
                    })
                );

                try {
                    await queryFulfilled;
                    toast.success("Product deleted successfully!", { id: toastId });
                } catch (err) {
                    toast.error("Failed to delete product", { id: toastId });
                    patchResult.undo();
                }
            }
        }),
        toggleFeaturedProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Products'],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [
                { type: 'Products' },
                { type: 'Product', id },
                { type: 'Review', id },
            ],
        }),
        addReview: builder.mutation({
            query: ({ productId, reviewData }) => ({
                url: `/products/${productId}/add-review`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Product', id: productId },
                { type: 'Review', id: productId },
            ],
        }),

        editReview: builder.mutation({
            query: ({ productId, reviewData }) => ({
                url: `/products/${productId}/edit-review`, // ✅ fixed here
                method: 'PUT',
                body: reviewData,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Product', id: productId },
                { type: 'Review', id: productId },
            ],
        }),

        deleteReview: builder.mutation({
            query: (productId) => ({
                url: `/products/${productId}/delete-review`, // ✅ fixed here
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, productId) => [
                { type: 'Product', id: productId },
                { type: 'Review', id: productId },
            ],
        }),

    }),
})


export const {
    useGetAllProductsQuery,
    useGetProductsQuery,
    useRecommendedProductsQuery,
    useFeaturedProductsQuery,
    useCreateProductsMutation,
    useDeleteProductMutation,
    useToggleFeaturedProductMutation,
    useGetProductByIdQuery,
    useAddReviewMutation,
    useEditReviewMutation,
    useDeleteReviewMutation
} = productsApi




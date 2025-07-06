import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-hot-toast'

// Custom baseQuery with refresh logic
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.MODE === "development"
        ? "http://localhost:5000/api/v1"
        : "/api/v1",
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh token
        const refreshResult = await baseQuery(
            { url: '/auth/refresh-token', method: 'POST' },
            api,
            extraOptions
        );
        if (refreshResult.data) {
            // Retry original query
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Optionally: dispatch logout or show error
        }
    }
    return result;
};

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        // ...your endpoints (no change needed here)
        getAllProducts: builder.query({
            query: () => ({
                url: '/products',
                method: 'GET',
            }),
            providesTags: ['Products'],
        }),
        createProducts: builder.mutation({
            query: (product) => ({
                url: '/products',
                method: 'POST',
                body: product,
                'content-type': 'multipart/form-data',
            }),
            invalidatesTags: ['Product'],
            async onQueryStarted(arg, { queryFulfilled }) {
                const toastId = toast.loading('Adding product...');
                try {
                    await queryFulfilled;
                    toast.success('Product added successfully!', { id: toastId });
                } catch (err) {
                    toast.error('Failed to add product', { id: toastId });
                }
            },
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
            async onQueryStarted(arg, { queryFulfilled }) {
                const toastId = toast.loading('Deleting product...');
                try {
                    await queryFulfilled;
                    toast.success('Product deleted successfully!', { id: toastId });
                } catch (err) {
                    toast.error('Failed to delete product', { id: toastId });
                }
            }
        }),
        toggleFeaturedProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Product'],
            async onQueryStarted(arg, { queryFulfilled }) {
                const toastId = toast.loading('Toggling product...');
                try {
                    await queryFulfilled;
                    toast.success('Product toggled successfully!', { id: toastId });
                } catch (err) {
                    toast.error('Failed to toggle product', { id: toastId });
                }
            }
        })

    }),
})


export const {
    useGetAllProductsQuery,
    useCreateProductsMutation,
    useDeleteProductMutation,
    useToggleFeaturedProductMutation
} = productsApi




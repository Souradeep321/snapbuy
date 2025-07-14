import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './customBaseQuery'


export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        getCartItems: builder.query({
            query: () => {
                return {
                    url: '/cart',
                    method: 'GET',
                }
            },
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (payload) => {
                return {
                    url: '/cart',
                    method: 'POST',
                    body: payload,
                }
            },
            invalidatesTags: ['Cart'],
        }),
        removeCartItem: builder.mutation({
            query: ({ productId, size }) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
                body: { size },
            }),
            invalidatesTags: ['Cart'],
            async onQueryStarted({ productId, size }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCartItems', undefined, (draft) => {
                        if (!Array.isArray(draft.data)) return;

                        draft.data = draft.data.filter(
                            (item) => item.product._id !== productId || item.size !== size
                        );
                    })
                );

                try {
                    await queryFulfilled;
                } catch (err) {
                    patchResult.undo();
                    if (err?.error?.status !== 404) {
                        toast.error("Failed to remove product from cart");
                    }
                }
            },

        }),
        updateCartItemQuantity: builder.mutation({
            query: ({ productId, quantity ,size}) => {
                return {
                    url: `/cart/${productId}`,
                    method: 'PATCH',
                    body: { quantity , size},
                }
            },
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => {
                return {
                    url: '/cart',
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Cart'],
        }),
    })
})

export const {
    useGetCartItemsQuery,
    useAddToCartMutation,
    useRemoveCartItemMutation,
    useUpdateCartItemQuantityMutation,
    useClearCartMutation
} = cartApi

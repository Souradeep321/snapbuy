// store/orderApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './customBaseQuery';


export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query: () => ({
                url: '/orders/my',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: 'GET',
            }),
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: '/orders',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/orders/${orderId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Orders'],
        }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Orders'],
        })
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation
} = orderApi;

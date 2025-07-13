// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { baseQueryWithReauth } from './customBaseQuery'

// export const couponApi = createApi({
//     reducerPath: 'couponApi',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Coupon'],
//     endpoints: (builder) => ({
//         getAllCoupons: builder.query({
//             query: () => ({
//                 url: '/coupons',
//                 method: 'GET',
//             }),
//             providesTags: ['Coupon'],
//         }),
//         getMyCoupon: builder.query({
//             query: () => ({
//                 url: '/coupons/mine',
//                 method: 'GET',
//             }),
//             providesTags: ['Coupon'],
//         }),
//     }),
// })

// export const { useGetAllCouponsQuery, useGetMyCouponQuery } = couponApi


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './customBaseQuery'

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Analytics'],
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: () => {
                return {
                    url: '/analytics',
                    method: 'GET',
                }
            },
        }),
    }),
})

export const { useGetAnalyticsQuery } = analyticsApi




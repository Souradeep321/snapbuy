import { createApi,fetchBaseQuery  } from '@reduxjs/toolkit/query/react'

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.MODE === "development"
        ? "http://localhost:5000/api/v1"
        : "/api/v1",
        credentials: 'include',
    }),
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




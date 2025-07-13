// src/store/customBaseQuery.js

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './userReducer';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast'


const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1',
  credentials: 'include', // to send cookies
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refreshing the token
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry the original query after refreshing token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Optional: dispatch logout or show notification
      api.dispatch(logout());
      toast.error("Session expired. Please log in again.");
      console.warn('🔴 Token refresh failed. User has been logged out.');
    }
  }

  return result;
};

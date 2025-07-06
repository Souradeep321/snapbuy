import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userReducer";
import { analyticsApi } from './analyticsApi';
import { productsApi } from './productApi';

export const store = configureStore({
  reducer: {
    auth: userSlice,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer, // ← Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(analyticsApi.middleware)
      .concat(productsApi.middleware),
});

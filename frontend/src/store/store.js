import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userReducer";
import productSlice from "./productReducer";

import { analyticsApi } from './analyticsApi';
import { productsApi } from './productApi';
import { orderApi } from './orderApi';
import { cartApi } from './cartApi';
// import { couponApi } from './couponApi';
import { notificationApi } from './notificationApi';

export const store = configureStore({
  reducer: {
    auth: userSlice,
    searchProduct: productSlice,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer, // ← Add this line
    [orderApi.reducerPath]: orderApi.reducer, // ← Add this line
    [cartApi.reducerPath]: cartApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    // [couponApi.reducerPath]: couponApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(analyticsApi.middleware)
      .concat(productsApi.middleware)
      .concat(orderApi.middleware)
      .concat(cartApi.middleware)
      .concat(notificationApi.middleware),
      // .concat(couponApi.middleware),
});

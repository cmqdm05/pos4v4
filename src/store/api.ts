import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./index";
import { logout } from "./slices/authSlice";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Products",
    "Categories",
    "Sales",
    "Users",
    "Stores",
    "Discounts",
    "Roles",
    "Staff",
    "Notifications"
  ],
  keepUnusedDataFor: 0, // Immediately remove unused data
});

// Add middleware to handle unauthorized responses
export const apiMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action?.payload?.status === 401) {
    store.dispatch(logout());
  }
  return next(action);
};
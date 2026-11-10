/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setAccessToken } from "../features/auth";
import { clearAuthCookies, getClientCookie, isJwtTokenValid } from "@/lib/authCookies";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth?.accessToken;
    const cookieToken =
      getClientCookie("accessToken") || getClientCookie("token");
    const token =
      stateToken || (isJwtTokenValid(cookieToken) ? cookieToken : null);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include", // Includes HttpOnly cookies like refresh token
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refreshing the access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const payload = refreshResult.data as any;
      const newAccessToken = payload?.data?.accessToken || payload?.accessToken;
      if (newAccessToken && isJwtTokenValid(newAccessToken)) {
        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${newAccessToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `token=${newAccessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        api.dispatch(setAccessToken(newAccessToken));

        // Retry the initial query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        clearAuthCookies();
        api.dispatch(logout());
      }
    } else {
      clearAuthCookies();
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "auth",
    "user",
    "profile",
    "contact",
    "Product",
    "Category",
    "Order",
    "AdminOverview",
    "Review",
    "settings",
  ],
  endpoints: () => ({}),
});

export default baseApi;

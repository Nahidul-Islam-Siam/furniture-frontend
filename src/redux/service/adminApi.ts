import { baseApi } from "../api/baseApi";
import type { IUserProfile } from "./profileData";

export interface IAdminOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  monthlySales: { month: string; amount: number }[];
}

export interface AllUsersResponse {
  success: boolean;
  message?: string;
  data: IUserProfile[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<
      { success: boolean; data: IAdminOverview },
      void
    >({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      providesTags: ["AdminOverview"],
    }),
    getAllUsers: builder.query<
      AllUsersResponse,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetAdminOverviewQuery, useGetAllUsersQuery } = adminApi;

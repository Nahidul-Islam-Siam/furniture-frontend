import { baseApi } from "../api/baseApi";

export interface IAdminOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  monthlySales: { month: string; amount: number }[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<{ success: boolean; data: IAdminOverview }, void>({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      providesTags: ["AdminOverview"],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = adminApi;


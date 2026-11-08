import { baseApi } from "../api/baseApi";

export interface IReview {
  _id: string;
  orderId?: string;
  trackingRef?: string;
  userId?: {
    _id: string;
    name: string;
    email?: string;
    avatar?: { url: string };
  };
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  orderId?: string;
  trackingRef?: string;
}

export interface ReviewListResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: IReview[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface SingleReviewResponse {
  success: boolean;
  message?: string;
  data: IReview;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicReviews: builder.query<
      ReviewListResponse,
      { isFeatured?: boolean; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/reviews/public",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Review"],
    }),

    createReview: builder.mutation<SingleReviewResponse, CreateReviewPayload>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),

    getAdminReviews: builder.query<
      ReviewListResponse,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/reviews/admin",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Review"],
    }),

    updateReviewStatus: builder.mutation<
      SingleReviewResponse,
      { id: string; status?: "pending" | "approved" | "rejected"; isFeatured?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/reviews/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetPublicReviewsQuery,
  useCreateReviewMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;

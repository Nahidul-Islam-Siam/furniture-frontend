import { baseApi } from "../api/baseApi";
import { IProductItem } from "./productApi";

export interface IOrderItem {
  product: IProductItem | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IShippingAddress {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  currency?: string;
  paymentMethod: "sslcommerz" | "stripe" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      { success: boolean; message: string; data: IOrder },
      Partial<IOrder>
    >({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "AdminOverview"],
    }),
    getAllOrders: builder.query<
      { success: boolean; meta: any; data: IOrder[] },
      { page?: number; limit?: number; orderStatus?: string } | void
    >({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Order"],
    }),
    getMyOrders: builder.query<{ success: boolean; data: IOrder[] }, void>({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<{ success: boolean; data: IOrder }, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<
      { success: boolean; message: string; data: IOrder },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order", "AdminOverview"],
    }),
    cancelOrder: builder.mutation<
      { success: boolean; message: string; data: IOrder },
      string
    >({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Order", "AdminOverview"],
    }),
    initiateSSLCommerz: builder.mutation<
      { success: boolean; data: { gatewayUrl: string } },
      string
    >({
      query: (orderId) => ({
        url: `/payments/sslcommerz/initiate/${orderId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useInitiateSSLCommerzMutation,
} = orderApi;

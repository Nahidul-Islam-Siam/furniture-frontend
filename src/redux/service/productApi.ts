import { baseApi } from "../api/baseApi";
import { ICategoryItem } from "./categoryApi";

export interface IProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ICategoryItem | string;
  stock: number;
  sku?: string;
  images: string[];
  material?: string;
  colors?: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: string;
  };
  weight?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductQueryParams {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IProductListResponse {
  success: boolean;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IProductItem[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProductListResponse, IProductQueryParams | void>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query<{ success: boolean; data: IProductItem }, string>({
      query: (slug) => ({
        url: `/products/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "Product", id: slug }],
    }),
    getProductById: builder.query<{ success: boolean; data: IProductItem }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<
      { success: boolean; message: string; data: IProductItem },
      Partial<IProductItem>
    >({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product", "AdminOverview"],
    }),
    updateProduct: builder.mutation<
      { success: boolean; message: string; data: IProductItem },
      { id: string; body: Partial<IProductItem> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product", "AdminOverview"],
    }),
    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "AdminOverview"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

import { baseApi } from "../api/baseApi";

export interface ICategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ success: boolean; data: ICategoryItem[] }, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<{ success: boolean; data: ICategoryItem }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<
      { success: boolean; message: string; data: ICategoryItem },
      Partial<ICategoryItem>
    >({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      { success: boolean; message: string; data: ICategoryItem },
      { id: string; body: Partial<ICategoryItem> }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

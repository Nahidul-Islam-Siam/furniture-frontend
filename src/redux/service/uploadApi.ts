import { baseApi } from "../api/baseApi";

export interface IUploadResult {
  url: string;
  publicId: string;
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      { success: boolean; data: IUploadResult | IUploadResult[] },
      FormData
    >({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
    deleteUpload: builder.mutation<
      { success: boolean; message: string },
      { publicId?: string; url?: string }
    >({
      query: (body) => ({
        url: "/upload",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const { useUploadFileMutation, useDeleteUploadMutation } = uploadApi;


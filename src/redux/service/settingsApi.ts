import { baseApi } from "../api/baseApi";

export interface ISettingPage {
  _id?: string;
  slug: string;
  title: string;
  htmlContent: string;
  isPublished?: boolean;
  updatedAt?: string;
}

export interface SettingResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: ISettingPage;
}

export interface AllSettingsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: ISettingPage[];
}

export interface UpdateSettingPayload {
  slug?: string;
  title?: string;
  htmlContent: string;
  isPublished?: boolean;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettingPage: builder.query<SettingResponse, string>({
      query: (slug) => ({
        url: `/settings/${slug}`,
        method: "GET",
      }),
      providesTags: (_result, _error, slug) => [{ type: "settings", id: slug }],
    }),

    updateSettingPage: builder.mutation<
      SettingResponse,
      { slug: string; data: UpdateSettingPayload }
    >({
      query: ({ slug, data }) => ({
        url: `/settings/${slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "settings", id: slug },
        { type: "settings", id: "LIST" },
      ],
    }),

    getPrivacyPolicy: builder.query<SettingResponse, void>({
      query: () => ({
        url: "/settings/privacy-policy",
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "privacy-policy" }],
    }),

    updatePrivacyPolicy: builder.mutation<SettingResponse, UpdateSettingPayload>({
      query: (body) => ({
        url: "/settings/privacy-policy",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "settings", id: "privacy-policy" }],
    }),

    getTermsAndConditions: builder.query<SettingResponse, void>({
      query: () => ({
        url: "/settings/terms-and-conditions",
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "terms-and-conditions" }],
    }),

    updateTermsAndConditions: builder.mutation<SettingResponse, UpdateSettingPayload>({
      query: (body) => ({
        url: "/settings/terms-and-conditions",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "settings", id: "terms-and-conditions" }],
    }),

    getAboutUs: builder.query<SettingResponse, void>({
      query: () => ({
        url: "/settings/about-us",
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "about-us" }],
    }),

    updateAboutUs: builder.mutation<SettingResponse, UpdateSettingPayload>({
      query: (body) => ({
        url: "/settings/about-us",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "settings", id: "about-us" }],
    }),

    getAllSettings: builder.query<AllSettingsResponse, void>({
      query: () => ({
        url: "/settings/all-pages",
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSettingPageQuery,
  useUpdateSettingPageMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetAllSettingsQuery,
} = settingsApi;


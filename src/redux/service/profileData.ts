import { baseApi } from "@/redux/api/baseApi";

export interface IUserProfile {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
  isEmailVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: IUserProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?:
    | {
        url: string;
        publicId?: string;
      }
    | string;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: IUserProfile;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  statusCode?: number;
  message: string;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateUserProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: "/user/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["profile"],
    }),

    changeUserPassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordPayload
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
} = profileApi;

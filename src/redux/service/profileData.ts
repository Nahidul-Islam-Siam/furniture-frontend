import { baseApi } from "@/redux/api/baseApi";

export interface ProfileImage {
  id: string;
  refId: string;
  refType: string;
  url: string;
  alt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  region?: string;
  country?: string;
  presentAddress?: string;
  permanentAddress?: string;
  company?: string;
  registrationId?: string;
  nationalId?: string;
  TaxId?: string;
  createdAt?: string;
  updatedAt?: string;
  Image?: ProfileImage[];
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    userStatus?: string;
    approvalStatus?: string;
    isEmailVerified?: boolean;
    isDeleted?: boolean;
    profile?: ProfileData;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    profile: ProfileData;
  };
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: "/users/get-profile-data",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateUserProfile: builder.mutation<
      UpdateProfileResponse,
      {
        image?: File;
        bodyData: Partial<ProfileData>;
      }
    >({
      query: ({ image, bodyData }) => {
        const formData = new FormData();
        if (image) {
          formData.append("image", image);
        }
        formData.append("bodyData", JSON.stringify(bodyData));

        return {
          url: "/users/update-profile",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["profile"],
    }),

    changeUserPassword: builder.mutation({
      query: (bodyData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: bodyData,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
} = profileApi;

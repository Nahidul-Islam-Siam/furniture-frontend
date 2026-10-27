/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface CreateContactUsPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface CreateContactUsPartnerPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addContact: builder.mutation<any, CreateContactUsPayload>({
      query: (body) => ({
        url: "/contact/send-contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["contact"],
    }),

    addContactPartner: builder.mutation<any, CreateContactUsPartnerPayload>({
      query: (body) => ({
        url: "/contact/send-message-to-partners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useAddContactMutation,
  useAddContactPartnerMutation,
} = contactApi;

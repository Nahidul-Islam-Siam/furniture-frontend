import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuthCookies } from "@/lib/authCookies";
import type { UserType } from "../service/auth/authApi";
export type { UserType };

export interface AuthState {
  user: UserType | null;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.isLoading = false;
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = !!action.payload.user;
      state.error = null;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.token = action.payload;
      if (!action.payload) {
        state.isAuthenticated = false;
      }
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateUserAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user = {
          ...state.user,
          avatar: { url: action.payload, publicId: "" },
        };
      }
    },
    updateUserProfileData(
      state,
      action: PayloadAction<{ name?: string; phone?: string; avatar?: string }>
    ) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...(action.payload.name && { name: action.payload.name }),
          ...(action.payload.phone && { phone: action.payload.phone }),
          ...(action.payload.avatar && {
            avatar: { url: action.payload.avatar, publicId: "" },
          }),
        };
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.loading = false;
      state.error = null;
      clearAuthCookies();
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsLoading,
  setError,
  updateUserAvatar,
  updateUserProfileData,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

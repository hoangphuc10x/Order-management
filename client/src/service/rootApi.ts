import { RootState } from "@/redux/store";
import { login, logout } from "@/redux/slices/authSlice";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  phone: string;
  role: string;
  email?: string;
  fulname?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 400) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    const userInfo = (api.getState() as RootState).auth.userInfo;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      ) as { data: AuthResponse };

      const newAccessToken = refreshResult?.data?.accessToken;
      if (newAccessToken) {
        api.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken,
            userInfo
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
       await api.dispatch(logout());
       window.location.href = "/";
      }
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "ITEM",
    "ITEM_ADMIN",
    "ORDER",
    "ITEM_DETAIL",
    "TABLES",
    "CHEF",
    "DUPITIEM",
    "DISCOUNT",
  ],
  refetchOnFocus: true,
  // c4: tu dong refetch lai du lieu khi mat mang
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterFormData>({
      query: (props) => ({
        url: "/auth/signup",
        body: { ...props },
        method: "POST",
      }),
    }),
    login: builder.mutation<AuthResponse, LoginFormData>({
      query: (formData) => ({
        url: "/auth/login",
        body: formData,
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (refreshToken) => {
        return {
          url: "/auth/refresh-token",
          body: { refreshToken },
          method: "POST",
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = rootApi;

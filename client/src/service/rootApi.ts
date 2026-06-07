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

// Kiểm tra lỗi có phải do token (hết hạn / không hợp lệ / thiếu) hay không
const isAuthError = (result: Awaited<ReturnType<typeof baseQuery>>): boolean => {
  const status = result?.error?.status;
  const message =
    ((result?.error?.data as { message?: string } | undefined)?.message || "")
      .toLowerCase();
  return (
    (status === 400 && message.includes("invalid token")) ||
    (status === 401 && message.includes("token"))
  );
};

// Điều hướng về trang đăng nhập phù hợp với vai trò
const redirectToLogin = (role?: string | null) => {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return; // tránh lặp vô hạn
  // Nhân sự nội bộ -> đăng nhập quản trị; khách/người dùng -> đăng nhập cho khách
  const isStaff = role === "manager" || role === "staff" || role === "chef" || role === "chef_head";
  window.location.href = isStaff ? "/login/admin" : "/login";
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (isAuthError(result)) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    const userInfo = (api.getState() as RootState).auth.userInfo;

    if (refreshToken) {
      const refreshResult = (await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      )) as { data?: AuthResponse };

      const newAccessToken = refreshResult?.data?.accessToken;
      if (newAccessToken) {
        api.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken,
            userInfo,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh thất bại -> đăng xuất và về trang đăng nhập
        api.dispatch(logout());
        redirectToLogin(userInfo?.role);
      }
    } else {
      // Không có refresh token (token hết hạn / khách chưa đăng nhập)
      api.dispatch(logout());
      redirectToLogin();
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

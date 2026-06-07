import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string | null;
  name: string | null;
  username: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string | null;
  isActive: boolean | null;
  lastLogin: string | null | null;
  createdAt: string | null;
  updatedAt: string | null;
  __v: number | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo; // Update this to a more specific type if available
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  userInfo: {
    _id: null,
    name: null,
    username: null,
    email: null,
    password: null,
    phone: null,
    avatarUrl: null,
    role: null,
    isActive: null,
    lastLogin: null ,
    createdAt: null,
    updatedAt: null,
    __v: null,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Define types for action payloads
    login: (
      state,
      action: PayloadAction<{ accessToken: string; userInfo: UserInfo; refreshToken: string  }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.userInfo = action.payload.userInfo;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: () => initialState,
    // saveUserInfo: (state, action: PayloadAction<UserInfo>) => {
    //   state.userInfo = action.payload;
    // },
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

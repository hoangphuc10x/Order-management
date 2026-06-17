import { Middleware } from "@reduxjs/toolkit";
import { logout } from "./slices/authSlice";
import { persistor } from "./store";
import { rootApi } from "../service/rootApi";

export const logOutMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if ((action as { type: string }).type === logout.type) {
    // Đăng xuất: xoá cache đã lưu (localStorage) và toàn bộ cache
    // RTK Query trong bộ nhớ để tài khoản đăng nhập sau không thấy dữ liệu cũ.
    persistor.purge();
    store.dispatch(rootApi.util.resetApiState());
  }
  return result;
};

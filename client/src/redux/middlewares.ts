import { Middleware } from "@reduxjs/toolkit";
import { logout } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware: Middleware = () => (next) => (action) => {
  if ((action as { type: string }).type === logout.type) {
    persistor.purge();
  }
  return next(action);
};

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { rootApi } from "../service/rootApi"; // Assuming rootApi is defined in your services folder
import { logOutMiddleware } from "./middlewares";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";
import orderItemReducer from "./slices/orderSlice";
import tableReducer from "./slices/tableSlice";
import orderIdReducer from "./slices/orderCurrentSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
// Type for persisted configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

// Persist the authReducer with the given configuration
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    orderItem: orderItemReducer,
    table: tableReducer,
    orderId: orderIdReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  })
);

// Configure the store with persistedReducer and middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
// Type for RootState based on the configured store
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
// Export persistor for managing persisted state

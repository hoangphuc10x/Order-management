import { PersistGate } from "redux-persist/integration/react";
import { createRoot } from "react-dom/client";
import "./index.scss";
// import App from './App.tsx'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

import { Toaster } from "sonner";

import SocketProvider from "./provider/SocketProvider.tsx";
import { router } from "./routes.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {/* <ModalProvider> */}
      <SocketProvider>
        <RouterProvider router={router}></RouterProvider>
        <Toaster position="top-right" />
      </SocketProvider>
      {/* <Dialog /> */}
      {/* </ModalProvider> */}
    </PersistGate>
  </Provider>
);

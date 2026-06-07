
import { ReactNode, createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

//connect to server
export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8000", {
  autoConnect: false,
//   path: "/v1/we-connect/socket.io",
});

const SocketContext = createContext({});

export const useSocketContext = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const token = useSelector((store : RootState) => store.auth.accessToken);
  useEffect(() => {
    // socket.auth = { token };
    socket.connect();
    socket.on("connect", () => {
      console.log("connected to socket server");
    });
    socket.on("disconnect", () => {
      console.log("disconnected from socket server");
    });
    // socket.on("tableStatusChanged", (data) => {
    //   console.log("📩 Received tableStatusChanged event:", data);
    // });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      // socket.off("tableStatusChanged")
      socket.disconnect();
    };
  }, []);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

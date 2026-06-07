import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useUserInfo = () => {
    return useSelector((state : RootState) => state.auth.userInfo);
}
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useTableInfo = () => {
    return useSelector((state : RootState) => state.table.tableInfo);
}
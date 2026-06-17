import { Navigate, Outlet } from "react-router-dom";
import { useTableInfo } from "@/hook/table";

// Bắt buộc đã quét bàn (có tableInfo) mới vào được luồng đặt món.
// Chưa quét -> đưa sang trang hướng dẫn quét QR.
const RequireTable = () => {
  const { _id } = useTableInfo();
  return _id ? <Outlet /> : <Navigate to="/scan" replace />;
};

export default RequireTable;

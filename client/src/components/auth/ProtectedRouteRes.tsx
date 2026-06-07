// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProtectedRouteRes = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = useSelector((state: RootState) => state.auth.userInfo.role);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (!token) {
    return (
      <Navigate
        to="/login/admin"
        replace
      />
    );
  }
  return allowedRoles.includes(role?.toLowerCase() ?? "") ? (
    <Outlet />
  ) : (
    <Navigate to="/login/admin" replace />
  );
};

export default ProtectedRouteRes;

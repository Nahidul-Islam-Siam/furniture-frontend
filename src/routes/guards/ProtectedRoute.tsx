import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux";

export const ProtectedRoute = () => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

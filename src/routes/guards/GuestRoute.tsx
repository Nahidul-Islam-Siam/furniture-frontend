import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux";

export const GuestRoute = () => {
  const { user, accessToken } = useAppSelector((state) => state.auth);

  if (accessToken || user) {
    // If logged in as ADMIN, send to /admin, else /dashboard
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

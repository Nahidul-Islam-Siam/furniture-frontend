import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux";

interface RoleGuardProps {
  allowedRoles: string[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Not logged in -> redirect to login with intended location
  if (!accessToken && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  const userRole = user?.role?.toUpperCase() || "USER";
  const hasAccess = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

  if (!hasAccess) {
    // If an ordinary user tries to access /admin, redirect them to their user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;

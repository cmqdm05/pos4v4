import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { hasPermission } from "../utils/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute = ({
  children,
  requiredPermission,
}: ProtectedRouteProps) => {
  const { token, staff } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Don't redirect if we're already on login, register, or staff login pages
  const isAuthPage = ["/login", "/register", "/staff/login"].includes(
    location.pathname
  );
  if (!token && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && staff) {
    const hasRequiredPermission = hasPermission(
      staff.role.permissions,
      requiredPermission
    );
    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

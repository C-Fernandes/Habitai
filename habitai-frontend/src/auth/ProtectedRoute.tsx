import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || user == null) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
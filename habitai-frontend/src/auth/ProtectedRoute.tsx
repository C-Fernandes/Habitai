import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useRef } from "react";

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const toastShownRef = useRef(false);

  if (!isAuthenticated || user == null) {
    if (!toastShownRef.current) {
      toast.error("Você precisa estar logado para acessar essa página.");
      toastShownRef.current = true;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
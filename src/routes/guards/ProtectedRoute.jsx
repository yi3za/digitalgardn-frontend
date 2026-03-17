import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authStatusSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route qui protege les pages reservees aux utilisateurs connectes
 */
export function ProtectedRoute() {
  const status = useSelector(authStatusSelector);
  // Si l'utilisateur n'est pas authentifie, redirection vers login
  if (status === AUTH_STATUS.UNAUTHENTICATED)
    return <Navigate to="/login" replace />;
  return <Outlet />;
}

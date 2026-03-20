import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Route qui protege les pages reservees aux utilisateurs connectes
 */
export function ProtectedRoute({ children }) {
  const { status } = useSelector(authSelector);
  // Si l'utilisateur n'est pas authentifie, redirection vers login
  if (status === AUTH_STATUS.UNAUTHENTICATED)
    return <Navigate to="/login" replace />;
  return children;
}

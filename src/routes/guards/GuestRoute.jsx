import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authStatusSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Route qui protege les pages reservees aux visiteurs non connectes
 */
export function GuestRoute({ children }) {
  const status = useSelector(authStatusSelector);
  // Si l'utilisateur est deja authentifie, il est redirige vers la page d'accueil
  if (status === AUTH_STATUS.AUTHENTICATED) return <Navigate to="/" replace />;
  return children;
}

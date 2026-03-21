import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route qui protege les pages reservees aux visiteurs non connectes
 */
export function GuestRoute() {
  const { status } = useSelector(authSelector);
  // Si l'utilisateur est deja authentifie, il est redirige vers la page d'accueil
  if (status === AUTH_STATUS.AUTHENTICATED) return <Navigate to="/" replace />;
  return <Outlet />;
}

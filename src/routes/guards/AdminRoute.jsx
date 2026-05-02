import { AUTH_ROLE, AUTH_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route reservee exclusivement aux administrateurs
 */
export function AdminRoute() {
  // Recuperer les informations d'authentification
  const { user, status } = useSelector(authSelector);
  // Si l'utilisateur n'est pas authentifie, rediriger vers la page de login
  if (status === AUTH_STATUS.UNAUTHENTICATED)
    return <Navigate to="/login" replace />;
  // Si l'utilisateur est authentifie mais n'est pas admin, rediriger vers la page d'accueil
  if (user?.role !== AUTH_ROLE.ADMIN) return <Navigate to="/" replace />;

  return <Outlet />;
}

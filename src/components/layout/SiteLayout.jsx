import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";

/**
 * Wrapper du site principal
 *
 * Ce composant sert de layout principal pour les pages du site
 * et gere les abonnements en temps reel pour les utilisateurs non administrateurs.
 */
export function SiteLayout() {
  // Recuperer les informations de l'utilisateur authentifie
  const { user } = useSelector(authSelector);
  // Determiner si l'utilisateur est un administrateur
  const isAdmin = user?.role === AUTH_ROLE.ADMIN;
  // S'abonner aux notifications en temps reel
  useRealtimeSubscriptions(isAdmin ? null : user?.id);
  // Rediriger l'admin vers son espace
  if (isAdmin) return <Navigate to="/admin" replace />;

  return <Outlet />;
}

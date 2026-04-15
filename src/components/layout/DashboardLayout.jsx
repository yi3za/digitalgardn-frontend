import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Layout du dashboard Freelance

 * Ce composant sert de couche de protection pour toutes les routes du dashboard freelance.
 */
export function DashboardLayout() {
  // Recuperation l'utilisateur
  const { user } = useSelector(authSelector);
  // Verification le role
  if (user.role !== AUTH_ROLE.FREELANCE) return <Navigate to="/" replace />;
  // Outlet rend le composant correspondant a la route enfant
  return <Outlet />;
}

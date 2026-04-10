import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route qui protege les pages reservees aux utilisateurs connectes
 */
export function ProtectedRoute() {
  // Recupere le statut et l'utilisateur authentifie
  const { user, status } = useSelector(authSelector);
  // Recupere l'emplacement actuel pour eviter les boucles de redirection
  const location = useLocation();
  // Verifie si la route est une route d'onboarding
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  // Si l'utilisateur n'est pas authentifie, redirection vers login
  if (status === AUTH_STATUS.UNAUTHENTICATED)
    return <Navigate to="/login" replace />;
  // Rediriger l'utilisateur vers la page d'onboarding s'il n'a pas encore termine l'onboarding
  if (!user?.onboarding_termine && !isOnboardingRoute)
    return <Navigate to="/onboarding" replace />;
  // Si l'onboarding est termine
  if (user?.onboarding_termine && isOnboardingRoute)
    return <Navigate to="/" replace />;

  return <Outlet />;
}

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { SplashScreen } from "@/components/feedback/splash-screen";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";

/**
 * Composant responsable de la configuration du routage global
 *
 * configure le router principal de l'application
 * utilise RouterProvider pour rendre le routage accessible dans l'application
 */
export function AppRouter() {
  // Recuperation de l'utilisateur connecte et du statut d'authentification
  const { user, status, loading } = useSelector(authSelector);
  // Abonnements en temps reel
  useRealtimeSubscriptions(user?.id);
  // Afficher SplashScreen tant que le statut d'authentification est IDLE
  if (status === AUTH_STATUS.IDLE || loading.getMe) return <SplashScreen />;

  return <RouterProvider router={router} />;
}

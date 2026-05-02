import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { SplashScreen } from "@/components/feedback/splash-screen";

/**
 * Composant responsable de la configuration du routage global
 */
export function AppRouter() {
  // Recuperer le statut d'authentification et l'etat de chargement
  const { status, loading } = useSelector(authSelector);
  // Afficher SplashScreen tant que le statut d'authentification est IDLE
  if (status === AUTH_STATUS.IDLE || loading.getMe) return <SplashScreen />;

  return <RouterProvider router={router} />;
}

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useSelector } from "react-redux";
import { authStatusSelector } from "@/features/auth/auth.selectors";
import { AUTH_STATUS } from "@/features/auth/auth.constants";
import { SplashScreen } from "@/components/ui/splash-screen";

/**
 * Composant responsable de la configuration du routage global
 *
 * configure le router principal de l'application
 * utilise RouterProvider pour rendre le routage accessible dans l'application
 */
export function AppRouter() {
  // Recuperation du statut d'authentification
  const status = useSelector(authStatusSelector);
  // Afficher SplashScreen tant que le statut d'authentification est IDLE
  if (status === AUTH_STATUS.IDLE) return <SplashScreen />;

  return <RouterProvider router={router} />;
}

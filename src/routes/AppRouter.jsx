import { RouterProvider } from "react-router-dom";
import { router } from "./router";

/**
 * Composant responsable de la configuration du routage global
 *
 * configure le router principal de l'application
 * utilise RouterProvider pour rendre le routage accessible dans l'application
 */
export default function AppRouter() {
  return <RouterProvider router={router} />;
}

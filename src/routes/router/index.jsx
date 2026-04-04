import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { HomePage } from "@/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { profilRoutes } from "./profil.routes";
import { GuestRoute } from "../guards/GuestRoute";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { settingsRoutes } from "./settings.routes";

/**
 * Creation du routeur principal de l'application
 *
 * MainLayout : layout global de l'application (header, footer, etc.)
 *
 * index : page d'accueil (HomePage)
 *
 * GuestRoute : routes accessibles uniquement aux utilisateurs non authentifies
 * (authRoutes : login, register, password-reset)
 *
 * ProtectedRoute : routes protegees necessitant une authentification
 * (profilRoutes : pages du profil utilisateur)
 * (settingsRoutes : pages de gestion des parametres du compte utilisateur)
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <GuestRoute />,
        children: [authRoutes],
      },
      {
        element: <ProtectedRoute />,
        children: [profilRoutes, settingsRoutes],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { HomePage } from "@/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { profilRoutes } from "./profil.routes";
import { GuestRoute } from "../guards/GuestRoute";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { settingsRoutes } from "./settings.routes";
import { onboardingRoutes } from "./onboarding.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { messagesRoutes } from "./messages.routes";
import { portefeuilleRoutes } from "./portefeuille.routes";
import { servicesRoutes } from "./services.routes";
import { freelancersRoutes } from "./freelancers.routes";
import { categoriesRoutes } from "./categories.routes";
import { competencesRoutes } from "./competences.routes";
import { commandesRoutes } from "./commandes.routes";
import { adminRoutes } from "./admin.routes";
import { AdminRoute } from "../guards/AdminRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SiteLayout } from "@/components/layout/SiteLayout";

/**
 * Creation du routeur principal de l'application
 *
 * SiteLayout : wrapper du site principal (abonnements temps reel)
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
 * (onboardingRoutes : pages de configuration initiale du profil, hors MainLayout)
 * (dashboardRoutes : pages du tableau de bord, hors MainLayout)
 * (messagesRoutes : pages de messagerie)
 * (portefeuilleRoutes : pages de consultation des transactions du portefeuille)
 * (commandesRoutes : pages de consultation des commandes et de leur details)
 *
 * AdminRoute : routes reservees aux administrateurs (isole du site principal)
 * (AdminLayout : layout de l'espace admin)
 * (adminRoutes : tableau de bord, utilisateurs, services, commandes)
 *
 * "*" : redirection vers la page d'accueil pour les routes non definies
 */
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
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
            children: [
              profilRoutes,
              settingsRoutes,
              messagesRoutes,
              commandesRoutes,
              portefeuilleRoutes,
            ],
          },
          categoriesRoutes,
          competencesRoutes,
          servicesRoutes,
          freelancersRoutes,
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [onboardingRoutes, dashboardRoutes],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [adminRoutes],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

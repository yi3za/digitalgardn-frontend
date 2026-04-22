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
 * (onboardingRoutes : pages de configuration initiale du profil, hors MainLayout)
 * (dashboardRoutes : pages du tableau de bord, hors MainLayout)
 * (messagesRoutes : pages de messagerie)
 * (servicesRoutes : pages de consultation des services publies)
 * (categoriesRoutes : pages de consultation des categories publiques)
 * (competencesRoutes : pages de consultation des competences publiques)
 * (freelancersRoutes : pages de consultation des freelances publies)
 * (portefeuilleRoutes : pages de consultation des transactions du portefeuille)
 *
 * "*" : redirection vers la page d'accueil pour les routes non definies
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
        children: [
          profilRoutes,
          settingsRoutes,
          messagesRoutes,
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
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

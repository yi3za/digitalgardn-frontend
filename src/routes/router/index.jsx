import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { HomePage } from "@/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { profilRoutes } from "./profil.routes";

/**
 * Creation du routeur principal de l'application
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      authRoutes,
      profilRoutes,
    ],
  },
]);

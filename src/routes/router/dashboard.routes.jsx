import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ServiceCreatePage } from "@/pages/dashboard/services/ServiceCreatePage";
import { ServiceEditPage } from "@/pages/dashboard/services/ServiceEditPage";
import { ServicesPage } from "@/pages/dashboard/services/ServicesPage";
import { ProfilPage } from "@/pages/profil/ProfilPage";

/**
 * Definit les routes liees au dashboard freelance
 *
 * DashboardLayout : layout principal du dashboard (protection + structure)
 *
 * dashboard : page principale du dashboard (vue globale, statistiques, etc.)
 * dashboard/services : liste des services du freelance
 * dashboard/services/create : page de creation d'un nouveau service
 * dashboard/services/:slug/edit : page de modification d'un service existant (identifie par son slug)
 */
export const dashboardRoutes = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "profil", element: <ProfilPage /> },
    {
      path: "services",
      children: [
        { index: true, element: <ServicesPage /> },
        { path: "create", element: <ServiceCreatePage /> },
        { path: ":slug/edit", element: <ServiceEditPage /> },
      ],
    },
  ],
};

import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { FreelancerShowPage } from "@/pages/freelancers/FreelancerShowPage";
import { ServiceShowPage } from "@/pages/services/ServiceShowPage";
import { AdminServicesPage } from "@/pages/admin/AdminServicesPage";
import { AdminCommandesPage } from "@/pages/admin/AdminCommandesPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { CategorieShowPage } from "@/pages/categories/CategorieShowPage";
import { AdminCompetencesPage } from "@/pages/admin/AdminCompetencesPage";
import { CompetenceShowPage } from "@/pages/competences/CompetenceShowPage";
import { AdminLanguesPage } from "@/pages/admin/AdminLanguesPage";
import { AdminPortefeuillesPage } from "@/pages/admin/AdminPortefeuillesPage";
import { AdminTransactionsPage } from "@/pages/admin/AdminTransactionsPage";
import { AdminAvisPage } from "@/pages/admin/AdminAvisPage";
import { ProfilPage } from "@/pages/profil/ProfilPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { PersonalInfoPage } from "@/pages/settings/PersonalInfoPage";
import { SecurityPage } from "@/pages/settings/SecurityPage";
import { DangerZonePage } from "@/pages/settings/DangerZonePage";

/**
 * Routes enfants de l'espace admin
 */
export const adminRoutes = {
  path: "admin",
  children: [
    { index: true, element: <AdminDashboardPage /> },
    { path: "users", element: <AdminUsersPage /> },
    { path: "freelancers/:username", element: <FreelancerShowPage /> },
    { path: "services", element: <AdminServicesPage /> },
    { path: "services/:slug", element: <ServiceShowPage /> },
    { path: "commandes", element: <AdminCommandesPage /> },
    { path: "categories", element: <AdminCategoriesPage /> },
    { path: "categories/:slug", element: <CategorieShowPage /> },
    { path: "competences", element: <AdminCompetencesPage /> },
    { path: "competences/:slug", element: <CompetenceShowPage /> },
    { path: "langues", element: <AdminLanguesPage /> },
    { path: "portefeuilles", element: <AdminPortefeuillesPage /> },
    { path: "transactions", element: <AdminTransactionsPage /> },
    { path: "avis", element: <AdminAvisPage /> },
    { path: "profil", element: <ProfilPage /> },
    {
      path: "settings",
      element: <SettingsLayout />,
      children: [
        { index: true, element: <SettingsPage /> },
        { path: "personal-info", element: <PersonalInfoPage /> },
        { path: "security", element: <SecurityPage /> },
        { path: "danger-zone", element: <DangerZonePage /> },
      ],
    },
  ],
};

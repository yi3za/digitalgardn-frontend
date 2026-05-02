import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminServicesPage } from "@/pages/admin/AdminServicesPage";
import { AdminCommandesPage } from "@/pages/admin/AdminCommandesPage";
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
    { path: "services", element: <AdminServicesPage /> },
    { path: "commandes", element: <AdminCommandesPage /> },
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

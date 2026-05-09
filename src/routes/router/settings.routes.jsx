import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { DangerZonePage } from "@/pages/settings/DangerZonePage";
import { PersonalInfoPage } from "@/pages/settings/PersonalInfoPage";
import { SecurityPage } from "@/pages/settings/SecurityPage";
import { SettingsPage } from "@/pages/settings/settingsPage";

/**
 * Definit les routes liees aux parametres du compte utilisateur
 *
 * SettingsLayout : fournit le contexte (isAdmin, user, loading) et la Card commune
 */
export const settingsRoutes = {
  path: "settings",
  element: <SettingsLayout />,
  children: [
    { index: true, element: <SettingsPage /> },
    { path: "personal-info", element: <PersonalInfoPage /> },
    { path: "security", element: <SecurityPage /> },
    { path: "danger-zone", element: <DangerZonePage /> },
  ],
};

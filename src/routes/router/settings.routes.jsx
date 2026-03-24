import { SettingsItemsLayout } from "@/components/layout/SettingsItemsLayout";
import { PersonalInfoPage } from "@/pages/settings/PersonalInfoPage";
import { SettingsPage } from "@/pages/settings/settingsPage";

/**
 * Definit les routes liees aux parametres du compte utilisateur
 *
 * SettingsItemsLayout : layout pour les pages de gestion des parametres utilisateur
 *
 * settings : page principale des parametres du compte utilisateur
 * personal-info : page de gestion des informations personnelles de l'utilisateur
 */
export const settingsRoutes = {
  path: "settings",
  children: [
    { index: true, element: <SettingsPage /> },
    {
      element: <SettingsItemsLayout />,
      children: [{ path: "personal-info", element: <PersonalInfoPage /> }],
    },
  ],
};

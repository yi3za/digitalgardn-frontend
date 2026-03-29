import { SettingsItemsLayout } from "@/components/layout/SettingsItemsLayout";
import { PersonalInfoPage } from "@/pages/settings/PersonalInfoPage";
import { SecurityPage } from "@/pages/settings/SecurityPage";
import { SettingsPage } from "@/pages/settings/settingsPage";

/**
 * Definit les routes liees aux parametres du compte utilisateur
 *
 * SettingsItemsLayout : layout pour les pages de gestion des parametres utilisateur
 *
 * settings : page principale des parametres du compte utilisateur
 * personal-info : page de gestion des informations personnelles de l'utilisateur
 * security : page de gestion de la securite du compte utilisateur
 */
export const settingsRoutes = {
  path: "settings",
  children: [
    { index: true, element: <SettingsPage /> },
    {
      element: <SettingsItemsLayout />,
      children: [
        { path: "personal-info", element: <PersonalInfoPage /> },
        { path: "security", element: <SecurityPage /> },
      ],
    },
  ],
};

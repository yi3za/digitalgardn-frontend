import { SettingsPage } from "@/pages/settings/settingsPage";

/**
 * Definit les routes liees aux parametres du compte utilisateur
 *
 * settings : page principale des parametres du compte utilisateur
 */
export const settingsRoutes = {
  path: "settings",
  children: [{ index: true, element: <SettingsPage /> }],
};

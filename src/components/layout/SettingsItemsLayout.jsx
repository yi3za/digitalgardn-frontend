import { Card } from "../ui";
import { Outlet } from "react-router-dom";

/**
 * Composant SettingsItemsLayout
 *
 * Ce layout est utilise pour les pages de gestion des parametres utilisateur
 */
export function SettingsItemsLayout() {
  return (
    <Card className="shadow-none border-none">
      {/* Contenu des sous-pages */}
      <Outlet />
    </Card>
  );
}

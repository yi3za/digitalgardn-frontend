import { useTranslation } from "react-i18next";
import { Button, Card } from "../ui";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

/**
 * Composant SettingsItemsLayout
 *
 * Ce layout est utilise pour les pages de gestion des parametres utilisateur
 */
export function SettingsItemsLayout() {
  // Hook de traduction
  const { t } = useTranslation("settings");

  return (
    <Card className="shadow-none border-none">
      <div className="flex justify-between items-center">
        <Button variant="link" asChild>
          <Link to="/settings">
            <ArrowLeftIcon />
            {t("action.back")}
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link to="/profil">{t("action.go_to_profil")}</Link>
        </Button>
      </div>
      {/* Contenu des sous-pages */}
      <Outlet />
    </Card>
  );
}

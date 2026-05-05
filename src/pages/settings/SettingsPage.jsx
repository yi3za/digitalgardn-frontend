import {
  Button,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { AlertTriangle, Lock, UserPen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";

// Configuration des parametres disponibles dans la page de gestion des parametres du compte utilisateur
const settingsItems = [
  {
    id: "personal_info",
    icon: UserPen,
    title: "items.personal_info.title",
    description: "items.personal_info.description",
    path: "personal-info",
  },
  {
    id: "security",
    icon: Lock,
    title: "items.security.title",
    description: "items.security.description",
    path: "security",
  },
  {
    id: "danger_zone",
    icon: AlertTriangle,
    title: "items.danger_zone.title",
    description: "items.danger_zone.description",
    path: "danger-zone",
    adminOnly: false,
  },
];

/**
 * Page de gestion des parametres du compte utilisateur
 * Affiche les differents parametres disponibles et permet d'acceder a leur gestion via des liens vers les pages correspondantes
 */
export function SettingsPage() {
  // Hook de traduction pour la page des parametres
  const { t } = useTranslation("settings");
  // Base de navigation selon le role (admin ou utilisateur)
  const { isAdmin } = useOutletContext();
  const settingsBase = isAdmin ? "/admin/settings" : "/settings";
  const profilBase = isAdmin ? "/admin/profil" : "/profil";

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link to={profilBase}>{t("action.go_to_profil")}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <ItemGroup className="grid grid-cols-3 gap-5">
          {settingsItems.map(({ id, icon: Icon, title, description, path }) => (
            <Link to={`${settingsBase}/${path}`} key={id}>
              <Item
                variant={`${id === "danger_zone" ? "destructive" : "outline"}`}
                className="col-span-1 hover:shadow-sm transition duration-300"
              >
                <ItemHeader>
                  <ItemMedia>
                    <Icon />
                  </ItemMedia>
                </ItemHeader>
                <ItemContent>
                  <ItemTitle>{t(title)}</ItemTitle>
                  <ItemDescription>{t(description)}</ItemDescription>
                </ItemContent>
              </Item>
            </Link>
          ))}
        </ItemGroup>
      </CardContent>
    </>
  );
}

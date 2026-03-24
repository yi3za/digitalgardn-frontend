import {
  Button,
  Card,
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
import { UserPen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Configuration des parametres disponibles dans la page de gestion des parametres du compte utilisateur
const settingsItems = [
  {
    id: "personal_info",
    icon: UserPen,
    title: "items.personal_info.title",
    description: "items.personal_info.description",
    link: "/settings/personal-info",
  },
];

/**
 * Page de gestion des parametres du compte utilisateur
 * Affiche les differents parametres disponibles et permet d'acceder a leur gestion via des liens vers les pages correspondantes
 */
export function SettingsPage() {
  // Hook de traduction pour la page des parametres
  const { t } = useTranslation("settings");

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link to="/profil">{t("action.go_to_profil")}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="grid grid-cols-3 gap-5">
          {settingsItems.map(({ id, icon: Icon, title, description, link }) => (
            <Link to={link} key={id}>
              <Item
                variant="outline"
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
    </Card>
  );
}

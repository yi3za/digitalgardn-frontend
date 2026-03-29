import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useTranslation } from "react-i18next";

/**
 * Page de gestion de la securite du compte utilisateur
 */
export function SecurityPage() {
  // Hook de traduction
  const { t } = useTranslation("settings");

  return (
    <>
      <CardHeader>
        <CardTitle>{t("items.security.title")}</CardTitle>
        <CardDescription>{t("items.security.description")}</CardDescription>
      </CardHeader>
      <CardContent>{/* ... */}</CardContent>
    </>
  );
}

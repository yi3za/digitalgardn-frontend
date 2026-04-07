import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ProfilPage } from "../profil/ProfilPage";
import { useTranslation } from "react-i18next";

/**
 * La page de configuration (setup) pour les freelances
 */
export function FreelancerSetupPage() {
  // Hook de traduction
  const { t } = useTranslation("onboarding");

  return (
    <>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfilPage />
      </CardContent>
      <CardFooter className="justify-end">
        <Button>{t("actions.submit")}</Button>
      </CardFooter>
    </>
  );
}

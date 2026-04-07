import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ProfilPage } from "../profil/ProfilPage";
import { useTranslation } from "react-i18next";
import { useLocation, useOutletContext } from "react-router-dom";

/**
 * La page de configuration (setup) pour les freelances
 */
export function FreelancerSetupPage() {
  // Hook de traduction
  const { t } = useTranslation("onboarding");
  // Recuperation des donnees du context
  const { handleOnboardingCompletion } = useOutletContext();

  return (
    <>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfilPage handleOnboardingCompletion={handleOnboardingCompletion} />
      </CardContent>
    </>
  );
}

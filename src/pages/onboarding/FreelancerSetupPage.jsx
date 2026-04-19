import { CardContent } from "@/components/ui";
import { ProfilPage } from "../profil/ProfilPage";
import { useOutletContext } from "react-router-dom";

/**
 * La page de configuration (setup) pour les freelances
 */
export function FreelancerSetupPage() {
  // Recuperation des donnees du context
  const { handleOnboardingCompletion } = useOutletContext();

  return (
    <>
      <CardContent>
        <ProfilPage handleOnboardingCompletion={handleOnboardingCompletion} />
      </CardContent>
    </>
  );
}

import { CardContent, ScrollArea } from "@/components/ui";
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
        <ScrollArea className="h-[60vh]">
          <ProfilPage handleOnboardingCompletion={handleOnboardingCompletion} />
        </ScrollArea>
      </CardContent>
    </>
  );
}

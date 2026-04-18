import { useSelector } from "react-redux";
import { Button } from "@/components/ui";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useService } from "@/features/public/catalog/services/services.query";
import { authSelector } from "@/features/auth/auth.selectors";
import { MessageCircle, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Page publique d'affichage d'un service
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["sections", "codes"]);
  // Requete pour recuperer les informations du service et de son freelance
  const serviceQuery = useService(slug);
  // Recuperation de l'utilisateur
  const { user: currentUser } = useSelector(authSelector);
  // Destructuration des etats de la requete pour faciliter
  const { data: service, isLoading, isError, error, refetch } = serviceQuery;
  // Recuperation du l'utlisateur proprietaire du service pour afficher les informations le concernant et permettre de le contacter
  const user = service?.user;
  // IsOwnService permet de determiner si le service affiche appartient a l'utilisateur connecte
  const isOwnService = currentUser?.id === user?.id;

  return (
    <div className="flex flex-col gap-5 flex-1">
      <ServiceDetailsCard
        service={service}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        t={t}
        showFreelancerSection={true}
        footerActions={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to={`/freelancers/${user?.username}`}>
                <UserRound /> {t("serviceShow.viewFreelancer")}
              </Link>
            </Button>
            {!isOwnService && (
              <Button asChild variant="outline">
                <Link to="/messages">
                  <MessageCircle /> {t("serviceShow.contact")}
                </Link>
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}

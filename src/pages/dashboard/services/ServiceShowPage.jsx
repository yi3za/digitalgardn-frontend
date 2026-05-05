import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useMyService } from "@/features/freelance/catalog/services/services.query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

/**
 * Page d'affichage d'un service dans le dashboard freelance, y compris les brouillons
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["dashboard", "common", "codes"]);
  // Requete pour recuperer les informations du service (y compris brouillons)
  const {
    data: service,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyService(slug);

  return (
    <div className="flex flex-col gap-5 flex-1">
      <ServiceDetailsCard
        service={service}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        t={t}
        showStatus={true}
      />
    </div>
  );
}

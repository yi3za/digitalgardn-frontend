import { useTranslation } from "react-i18next";
import { useMyServices } from "@/features/freelance/catalog/services/services.query";
import {
  CatalogItemsSection,
  ServicesGrid,
} from "@/components/sections/catalog";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";

/**
 * Page pour l'affichage des services du freelance connecté
 */
export function ServicesPage() {
  // Hook de traduction pour les textes de la page
  const { t } = useTranslation("dashboard");
  // Hook de navigation pour permettre la redirection
  const navigate = useNavigate();
  // Requete pour recuperer les services du freelance connecte
  const myServicesQuery = useMyServices();

  return (
    <CatalogItemsSection
      itemsQuery={myServicesQuery}
      title={t("services.title")}
      description={t("services.description")}
      renderItems={(services) => (
        <ServicesGrid
          services={services}
          linkTo="/dashboard/services"
          dashboard
        />
      )}
      action={
        <Button
          variant="link"
          onClick={() => navigate("/dashboard/services/create")}
        >
          {t("services.actions.create")}
        </Button>
      }
    />
  );
}

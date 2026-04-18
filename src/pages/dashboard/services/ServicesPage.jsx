import { useTranslation } from "react-i18next";
import { useMyServices } from "@/features/freelance/catalog/services/services.query";
import { CatalogItems } from "@/components/sections/catalog";
import { ServiceItem } from "@/components/sections/catalog/ServiceItem";
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
    <div className="flex flex-col flex-1">
      <div className="flex justify-end items-center gap-3">
        <Button onClick={() => navigate("/dashboard/services/create")}>
          {t("services.actions.create")}
        </Button>
      </div>
      <CatalogItems
        itemsQuery={myServicesQuery}
        title={t("services.title")}
        description={t("services.description")}
        linkTo="/dashboard/services"
        item={ServiceItem}
        dashboard
      />
    </div>
  );
}

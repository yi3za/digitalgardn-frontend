import { ServicesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices } from "@/features/public/catalog/services/services.query";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche tous les services publies
 */
export function ServicesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation("sections");
  // Requete pour recuperer les services publies
  const servicesQuery = useServices();

  return (
    <QueryItemsSection
      itemsQuery={servicesQuery}
      title={t("services.title")}
      description={t("services.description")}
      renderItems={(services) => (
        <ServicesGrid services={services} linkTo="/services" />
      )}
      action={
        <Button asChild variant="link">
          <Link to="/">
            <ArrowLeft /> {t("common.back")}
          </Link>
        </Button>
      }
    />
  );
}

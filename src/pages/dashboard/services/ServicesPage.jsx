import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyServices } from "@/features/freelance/catalog/services/services.query";
import { SERVICE_STATUS } from "@/features/freelance/catalog/services/services.status";
import { ServicesGrid } from "@/components/catalog";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";

// Configuration du filtre par statut pour les services du freelance
const MY_SERVICES_FILTERS_CONFIG = [
  { key: "search", type: "input" },
  {
    key: "statut",
    type: "select",
    options: Object.values(SERVICE_STATUS).map((v) => ({
      value: v,
      labelKey: `dashboard:services.show.status.${v === SERVICE_STATUS.EN_ATTENTE_APPROBATION ? "pending" : v === SERVICE_STATUS.PUBLIE ? "published" : v === SERVICE_STATUS.EN_PAUSE ? "paused" : v === SERVICE_STATUS.BROUILLON ? "draft" : "rejected"}`,
    })),
  },
];

/**
 * Page pour l'affichage des services du freelance connecte
 */
export function ServicesPage() {
  // Hook de traduction pour les textes de la page
  const { t } = useTranslation(["dashboard", "common"]);
  // Hook de navigation pour permettre la redirection
  const navigate = useNavigate();
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete pour recuperer les services du freelance connecte
  const myServicesQuery = useMyServices({ ...filters, page });
  const meta = myServicesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={myServicesQuery}
      title={t("services.title")}
      description={t("services.description")}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={MY_SERVICES_FILTERS_CONFIG}
          onApply={handleApplyFilters}
        />
      }
      paginationBar={
        (meta?.last_page ?? 0) > 1 ? (
          <PaginationBar
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
          />
        ) : null
      }
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

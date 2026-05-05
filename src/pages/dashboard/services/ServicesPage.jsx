import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyServices } from "@/features/freelance/catalog/services/services.query";
import { buildMyServicesFiltersConfig } from "@/features/freelance/catalog/services/services.filters";
import { ServicesTable } from "@/components/shared/ServicesTable";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { ServiceRowActions } from "./ServiceRowActions";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Page pour l'affichage des services du freelance connecte
 */
export function ServicesPage() {
  // Hook de traduction pour les textes de la page
  const { t } = useTranslation(["dashboard", "common"]);
  // Hook de navigation pour permettre la redirection
  const navigate = useNavigate();
  const { services: servicesBasePath } = useNavigationPaths();
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
          filtersConfig={buildMyServicesFiltersConfig(t)}
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
        <ServicesTable
          services={services}
          renderActions={(service) => <ServiceRowActions service={service} />}
        />
      )}
      action={
        <Button
          variant="link"
          onClick={() => navigate(`${servicesBasePath}/create`)}
        >
          {t("services.actions.create")}
        </Button>
      }
    />
  );
}

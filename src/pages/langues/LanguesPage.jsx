import { useState } from "react";
import { LanguesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useLangues } from "@/features/public/catalog/langues/langues.query";
import { buildLanguesFiltersConfig } from "@/features/public/catalog/langues/langues.filters";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche toutes les langues disponibles
 */
export function LanguesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete pour recuperer les langues publiques
  const languesQuery = useLangues({ ...filters, page });
  const meta = languesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={languesQuery}
      title={t("catalog:langues.title")}
      description={t("catalog:langues.description")}
      renderItems={(data) => <LanguesGrid langues={data?.items ?? data ?? []} />}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildLanguesFiltersConfig()}
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
    />
  );
}

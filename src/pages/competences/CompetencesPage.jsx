import { useState } from "react";
import { CompetencesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { buildCompetencesFiltersConfig } from "@/features/public/catalog/competences/competences.filters";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche toutes les competences disponibles
 */
export function CompetencesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete pour recuperer les competences publiques
  const competencesQuery = useCompetences({ ...filters, page });
  const meta = competencesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={competencesQuery}
      title={t("catalog:competences.title")}
      description={t("catalog:competences.description")}
      renderItems={(data) => (
        <CompetencesGrid
          competences={data?.items ?? data ?? []}
          variant="grid"
        />
      )}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildCompetencesFiltersConfig()}
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

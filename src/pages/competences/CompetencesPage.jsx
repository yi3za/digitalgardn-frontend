import { CompetencesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { buildCompetencesFiltersConfig } from "@/features/public/catalog/competences/competences.filters";
import { useTranslation } from "react-i18next";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { TaxonomySkeleton } from "@/components/skeletons";

/**
 * Page publique qui affiche toutes les competences disponibles
 */
export function CompetencesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters();
  // Requete pour recuperer les competences publiques
  const competencesQuery = useCompetences({ ...filters, page });
  const meta = competencesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={competencesQuery}
      title={t("catalog:competences.title")}
      description={t("catalog:competences.description")}
      loadingSkeleton={TaxonomySkeleton}
      loadingSkeletonProps={{ variant: "grid" }}
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
          initialValues={filters}
          onRefetch={competencesQuery.refetch}
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

import { CommandesGrid } from "@/components/commandes/CommandesGrid";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { useCommandes } from "@/features/account/commandes/commandes.query";
import { buildCommandesFiltersConfig } from "@/features/account/commandes/commandes.filters";
import { useTranslation } from "react-i18next";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { CommandesSkeleton } from "@/components/skeletons";

/**
 * Page publique qui affiche toutes les commandes disponibles
 */
export function CommandesPage({ dashboard = false }) {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["commandes", "common", "codes"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["statut"],
  });
  // Requete pour recuperer les commandes
  const commandesQuery = useCommandes({ ...filters, page });
  const meta = commandesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={commandesQuery}
      title={t("commandes:title")}
      description={t("commandes:description")}
      loadingSkeleton={CommandesSkeleton}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildCommandesFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
          onRefetch={commandesQuery.refetch}
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
      renderItems={(commandes) => (
        <CommandesGrid
          t={t}
          commandes={commandes}
          linkTo={dashboard ? "/dashboard/messages" : "/messages"}
        />
      )}
    />
  );
}

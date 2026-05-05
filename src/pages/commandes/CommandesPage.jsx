import { useState } from "react";
import { CommandesGrid } from "@/components/commandes/CommandesGrid";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { useCommandes } from "@/features/account/commandes/commandes.query";
import { buildCommandesFiltersConfig } from "@/features/account/commandes/commandes.filters";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche toutes les commandes disponibles
 */
export function CommandesPage({ dashboard = false }) {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["commandes", "common", "codes"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete pour recuperer les commandes
  const commandesQuery = useCommandes({ ...filters, page });
  const meta = commandesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={commandesQuery}
      title={t("commandes:title")}
      description={t("commandes:description")}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildCommandesFiltersConfig(t)}
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

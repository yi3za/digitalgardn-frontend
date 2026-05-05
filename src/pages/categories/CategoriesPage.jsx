import { useState } from "react";
import { CategoriesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { buildCategoriesFiltersConfig } from "@/features/public/catalog/categories/categories.filters";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche toutes les categories disponibles
 */
export function CategoriesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete pour recuperer les categories publiques
  const categoriesQuery = useCategories({ ...filters, page });
  const meta = categoriesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={categoriesQuery}
      title={t("catalog:categories.title")}
      description={t("catalog:categories.description")}
      renderItems={(data) => (
        <CategoriesGrid categories={data?.items ?? data ?? []} variant="grid" />
      )}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildCategoriesFiltersConfig()}
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

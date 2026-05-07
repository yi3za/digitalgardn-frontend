import { useState, useMemo } from "react";
import { ServicesGrid } from "@/components/catalog";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { useServices } from "@/features/public/catalog/services/services.query";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useLangues } from "@/features/public/catalog/langues/langues.query";
import { useTranslation } from "react-i18next";
import { useUrlFilters } from "@/hooks/useUrlFilters";

// Filtres supportes par la page services et synchronises avec l'URL
const URL_FILTER_KEYS = ["search", "categorie", "competence", "langue"];

/**
 * Page publique qui affiche tous les services publies
 */
export function ServicesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: URL_FILTER_KEYS,
  });
  // Chargement des options dynamiques pour les selects
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
  const languesQuery = useLangues({ limit: 100 });
  // Config des filtres construite depuis les donnees API (options dynamiques)
  const filtersConfig = useMemo(() => {
    const categorieOptions = (categoriesQuery.data?.items ?? []).flatMap(
      (parent) =>
        (parent.enfants ?? []).map((c) => ({ value: c.slug, label: c.nom })),
    );
    const competenceOptions = (competencesQuery.data?.items ?? []).flatMap(
      (parent) =>
        (parent.enfants ?? []).map((c) => ({ value: c.slug, label: c.nom })),
    );
    const langueOptions = (languesQuery.data?.items ?? []).map((langue) => ({
      value: langue.slug,
      label: langue.nom,
    }));
    return [
      { key: "search", type: "input" },
      {
        key: "categorie",
        type: "select",
        allLabel: t("catalog:filters.categories_label"),
        options: categorieOptions,
      },
      {
        key: "competence",
        type: "select",
        allLabel: t("catalog:filters.competences_label"),
        options: competenceOptions,
      },
      {
        key: "langue",
        type: "select",
        allLabel: t("catalog:filters.langues_label"),
        options: langueOptions,
      },
    ];
  }, [categoriesQuery.data, competencesQuery.data, languesQuery.data, t]);
  // Requete pour recuperer les services publies
  const servicesQuery = useServices({ ...filters, page });
  const meta = servicesQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={servicesQuery}
      title={t("catalog:services.title")}
      description={t("catalog:services.description")}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={filtersConfig}
          onApply={handleApplyFilters}
          initialValues={filters}
        />
      }
      paginationBar={
        <PaginationBar
          currentPage={meta?.current_page}
          lastPage={meta?.last_page}
          onPageChange={setPage}
        />
      }
      renderItems={(services) => <ServicesGrid services={services} />}
    />
  );
}

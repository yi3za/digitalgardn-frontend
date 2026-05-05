import { useState, useMemo } from "react";
import { ServicesGrid } from "@/components/catalog";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices } from "@/features/public/catalog/services/services.query";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useTranslation } from "react-i18next";

/**
 * Page publique qui affiche tous les services publies
 */
export function ServicesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Chargement des options dynamiques pour les selects
  const categoriesQuery = useCategories();
  const competencesQuery = useCompetences();
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
    ];
  }, [categoriesQuery.data, competencesQuery.data, t]);
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
      renderItems={(services) => <ServicesGrid services={services} />}
      action={
        <Button asChild variant="link">
          <Link to="/">
            <ArrowLeft /> {t("common:actions.back")}
          </Link>
        </Button>
      }
    />
  );
}

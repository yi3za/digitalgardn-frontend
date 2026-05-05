import { useState } from "react";
import { CategoriesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Configuration des filtres disponibles pour les categories
const CATEGORIES_FILTERS_CONFIG = [{ key: "search", type: "input" }];

/**
 * Page publique qui affiche toutes les categories disponibles
 */
export function CategoriesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  // Hook de navigation pour permettre la redirection
  const navigate = useNavigate();
  // Etat des filtres appliques
  const [filters, setFilters] = useState({});
  const handleApplyFilters = (newFilters) => setFilters(newFilters);
  // Requete pour recuperer les categories publiques
  const categoriesQuery = useCategories(filters);

  return (
    <QueryItemsSection
      itemsQuery={categoriesQuery}
      title={t("catalog:categories.title")}
      description={t("catalog:categories.description")}
      renderItems={(categories) => (
        <CategoriesGrid categories={categories} variant="grid" />
      )}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={CATEGORIES_FILTERS_CONFIG}
          onApply={handleApplyFilters}
        />
      }
      action={
        <Button type="button" variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft /> {t("common:actions.back")}
        </Button>
      }
    />
  );
}

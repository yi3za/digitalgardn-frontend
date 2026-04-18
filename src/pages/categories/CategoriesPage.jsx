import {
  CatalogItemsSection,
  CategoriesGrid,
} from "@/components/sections/catalog";
import { Button } from "@/components/ui";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Page publique qui affiche toutes les categories disponibles
 */
export function CategoriesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation("sections");
  // Hook de navigation pour permettre la redirection
  const navigate = useNavigate();
  // Requete pour recuperer les categories publiques
  const categoriesQuery = useCategories();

  return (
    <CatalogItemsSection
      itemsQuery={categoriesQuery}
      title={t("categories.title")}
      description={t("categories.description")}
      renderItems={(categories) => (
        <CategoriesGrid
          categories={categories}
          linkTo="/categories"
          variant="grid"
        />
      )}
      action={
        <Button type="button" variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft /> {t("common.back")}
        </Button>
      }
    />
  );
}

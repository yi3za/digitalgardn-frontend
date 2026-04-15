import {
  CatalogItems,
  CategorieItem,
  CompetenceItem,
  ServiceItem,
} from "@/components/sections/catalog";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useServices } from "@/features/public/catalog/services/services.query";
import { useTranslation } from "react-i18next";

/**
 * Page d'accueil de l'application
 */
export function HomePage() {
  // Hook de traduction
  const { t } = useTranslation(["sections"]);
  // CategoriesQuery contient generalement : data, isLoading, isError, etc.
  const categoriesQuery = useCategories();
  // competencesQuery contient generalement : data, isLoading, isError, etc.
  const competencesQuery = useCompetences();
  // servicesQuery contient generalement : data, isLoading, isError, etc.
  const servicesQuery = useServices();

  return (
    <>
      <CatalogItems
        itemsQuery={categoriesQuery}
        title={t("categories.title")}
        description={t("categories.description")}
        linkTo="/categories"
        item={CategorieItem}
        isScrollArea={true}
      />
      <CatalogItems
        itemsQuery={competencesQuery}
        title={t("competences.title")}
        description={t("competences.description")}
        linkTo="/competences"
        item={CompetenceItem}
        isScrollArea={true}
      />
      <CatalogItems
        itemsQuery={servicesQuery}
        title={t("services.title")}
        description={t("services.description")}
        linkTo="/services"
        item={ServiceItem}
      />
    </>
  );
}

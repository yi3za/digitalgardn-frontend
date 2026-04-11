import { ItemsCatalog } from "@/components/sections/catalog/ItemsCatalog";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
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

  return (
    <>
      <ItemsCatalog
        itemsQuery={categoriesQuery}
        title={t("categories.title")}
        description={t("categories.description")}
        linkTo="/categories"
      />
      <ItemsCatalog
        itemsQuery={competencesQuery}
        title={t("competences.title")}
        description={t("competences.description")}
        linkTo="/competences"
      />
    </>
  );
}

import {
  CategoriesGrid,
  CompetencesGrid,
  ServicesGrid,
} from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useServices } from "@/features/public/catalog/services/services.query";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Page d'accueil de l'application
 */
export function HomePage() {
  // Hook de traduction
  const { t } = useTranslation(["catalog", "common"]);
  // CategoriesQuery contient generalement : data, isLoading, isError, etc.
  const categoriesQuery = useCategories();
  // competencesQuery contient generalement : data, isLoading, isError, etc.
  const competencesQuery = useCompetences();
  // servicesQuery contient generalement : data, isLoading, isError, etc.
  const servicesQuery = useServices();

  return (
    <>
      <QueryItemsSection
        itemsQuery={categoriesQuery}
        title={t("catalog:categories.title")}
        description={t("catalog:categories.description")}
        renderItems={(categories) => (
          <CategoriesGrid categories={categories} linkTo="/categories" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/categories">
              {t("common:actions.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <QueryItemsSection
        itemsQuery={competencesQuery}
        title={t("catalog:competences.title")}
        description={t("catalog:competences.description")}
        renderItems={(competences) => (
          <CompetencesGrid competences={competences} linkTo="/competences" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/competences">
              {t("common:actions.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <QueryItemsSection
        itemsQuery={servicesQuery}
        title={t("catalog:services.title")}
        description={t("catalog:services.description")}
        renderItems={(services) => (
          <ServicesGrid services={services} linkTo="/services" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/services">
              {t("common:actions.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
    </>
  );
}

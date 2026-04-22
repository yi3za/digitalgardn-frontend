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
  const { t } = useTranslation(["sections"]);
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
        title={t("categories.title")}
        description={t("categories.description")}
        renderItems={(categories) => (
          <CategoriesGrid categories={categories} linkTo="/categories" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/categories">
              {t("common.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <QueryItemsSection
        itemsQuery={competencesQuery}
        title={t("competences.title")}
        description={t("competences.description")}
        renderItems={(competences) => (
          <CompetencesGrid competences={competences} linkTo="/competences" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/competences">
              {t("common.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
      <QueryItemsSection
        itemsQuery={servicesQuery}
        title={t("services.title")}
        description={t("services.description")}
        renderItems={(services) => (
          <ServicesGrid services={services} linkTo="/services" />
        )}
        action={
          <Button asChild variant="link">
            <Link to="/services">
              {t("common.viewAll")} <ArrowRight />
            </Link>
          </Button>
        }
      />
    </>
  );
}

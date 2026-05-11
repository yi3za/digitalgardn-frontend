import {
  CategoriesGrid,
  CompetencesGrid,
  FreelancersGrid,
  ServicesGrid,
} from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useTopFreelancers } from "@/features/public/catalog/freelancers/freelancers.query";
import { useServices } from "@/features/public/catalog/services/services.query";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSection } from "@/components/layout/HeroSection";

/**
 * Page d'accueil de l'application
 */
export function HomePage() {
  // Hook de traduction
  const { t } = useTranslation(["catalog", "common"]);
  // Limite pour la page d'accueil : fetchee depuis la base de donnees via le parametre limit
  const categoriesQuery = useCategories({ limit: 6 });
  const competencesQuery = useCompetences({ limit: 6 });
  const servicesQuery = useServices({ limit: 6 });
  // topFreelancersQuery contient la liste des meilleurs freelances
  const topFreelancersQuery = useTopFreelancers();

  return (
    <>
      <HeroSection t={t} />
      <QueryItemsSection
        itemsQuery={categoriesQuery}
        title={t("catalog:categories.title")}
        description={t("catalog:categories.description")}
        renderItems={(categories) => <CategoriesGrid categories={categories} />}
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
          <CompetencesGrid competences={competences} />
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
        itemsQuery={topFreelancersQuery}
        title={t("catalog:freelancers.title")}
        description={t("catalog:freelancers.description")}
        renderItems={(freelancers) => (
          <FreelancersGrid freelancers={freelancers} />
        )}
      />
      <QueryItemsSection
        itemsQuery={servicesQuery}
        title={t("catalog:services.title")}
        description={t("catalog:services.description")}
        renderItems={(services) => <ServicesGrid services={services} />}
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

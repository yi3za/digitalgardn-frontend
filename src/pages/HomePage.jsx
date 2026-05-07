import {
  CategoriesGrid,
  CompetencesGrid,
  FreelancersGrid,
  ServicesGrid,
} from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { SearchBar } from "@/components/shared/SearchBar";
import { useCategories } from "@/features/public/catalog/categories/categories.query";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { useTopFreelancers } from "@/features/public/catalog/freelancers/freelancers.query";
import { useServices } from "@/features/public/catalog/services/services.query";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/layout/Logo";

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
      <Card className="shadow-none border-none text-center gap-15 justify-center bg-background">
        <Logo />
        <CardHeader className="gap-3">
          <CardTitle className="text-5xl font-bold">
            {t("catalog:home.hero.title")}
          </CardTitle>
          <CardTitle className="text-6xl font-serif italic text-primary">
            {t("catalog:home.hero.titleAccent")}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("catalog:home.hero.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar />
        </CardContent>
        <CardFooter className="justify-center gap-3">
          <Button asChild size="sm">
            <Link to="/services">
              {t("catalog:home.hero.actions.services")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/categories">
              {t("catalog:home.hero.actions.categories")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/competences">
              {t("catalog:home.hero.actions.competences")}
            </Link>
          </Button>
        </CardFooter>
      </Card>

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

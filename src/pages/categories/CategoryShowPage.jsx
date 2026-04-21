import { CategoriesGrid, ServicesGrid } from "@/components/sections/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  useCategories,
  useServicesByCategorie,
} from "@/features/public/catalog/categories/categories.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Page publique qui affiche les services d'une categorie.
 * Si c'est un parent, affiche ses enfants en scroll horizontal + tous leurs services.
 * Si c'est un enfant, affiche uniquement ses propres services.
 */
export function CategoryShowPage() {
  const { slug } = useParams();
  const { t } = useTranslation("sections");
  const navigate = useNavigate();
  // Recupere toutes les categories pour trouver le nom et les enfants
  const categoriesQuery = useCategories();
  // Recupere les services de la categorie (ou sous-categorie) selectionnee
  const servicesQuery = useServicesByCategorie(slug);
  // Cherche d'abord parmi les parents, puis parmi les enfants
  const allCategories = categoriesQuery.data ?? [];
  // Cherche d'abord parmi les parents, puis parmi les enfants
  const category =
    allCategories.find((c) => c.slug === slug) ??
    allCategories.flatMap((c) => c.enfants ?? []).find((e) => e.slug === slug);
  // Les informations de la categorie pour l'affichage
  const title = category?.nom ?? `#${slug}`;
  const description = category?.description;
  // Les enfants de la categorie pour l'affichage
  const children = category?.enfants ?? [];

  return (
    <div className="flex flex-col flex-1">
      <Card className="shadow-none rounded-none border-none">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button type="button" variant="link" onClick={() => navigate(-1)}>
              <ArrowLeft /> {t("common.back")}
            </Button>
          </CardAction>
        </CardHeader>
        {children.length > 0 && (
          <CardContent>
            <CategoriesGrid categories={children} linkTo="/categories" />
          </CardContent>
        )}
      </Card>
      <QueryItemsSection
        itemsQuery={servicesQuery}
        title={t("services.title")}
        description={t("services.description")}
        renderItems={(services) => (
          <ServicesGrid services={services} linkTo="/services" />
        )}
      />
    </div>
  );
}

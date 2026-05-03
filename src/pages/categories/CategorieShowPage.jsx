import { CategoriesGrid, ServicesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataLoading,
  DataError,
} from "@/components/ui";
import {
  useCategories,
  useCategorieBySlug,
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
export function CategorieShowPage() {
  const { slug } = useParams();
  const { t } = useTranslation(["catalog", "common"]);
  const navigate = useNavigate();
  // Recupere la categorie par slug avec ses enfants
  const categorieQuery = useCategorieBySlug(slug);
  // Recupere les services de la categorie (ou sous-categorie) selectionnee
  const servicesQuery = useServicesByCategorie(slug);
  const {
    data: categorie,
    isLoading,
    isError,
    error,
    refetch,
  } = categorieQuery;
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Les informations de la categorie pour l'affichage
  const title = categorie?.nom;
  const description = categorie?.description;
  // Les enfants de la categorie pour l'affichage
  const children = categorie?.enfants ?? [];

  if (isLoading) return <DataLoading />;

  if (isError)
    return (
      <DataError
        errorCode={code}
        retryText={t("common:actions.retry")}
        onRetry={refetch}
      />
    );

  return (
    <div className="flex flex-col flex-1">
      <Card className="shadow-none rounded-none border-none">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button type="button" variant="link" onClick={() => navigate(-1)}>
              <ArrowLeft /> {t("common:actions.back")}
            </Button>
          </CardAction>
        </CardHeader>
        {children.length > 0 && (
          <CardContent>
            <CategoriesGrid categories={children} />
          </CardContent>
        )}
      </Card>
      <QueryItemsSection
        itemsQuery={servicesQuery}
        title={t("catalog:services.title")}
        description={t("catalog:services.description")}
        renderItems={(services) => <ServicesGrid services={services} />}
      />
    </div>
  );
}

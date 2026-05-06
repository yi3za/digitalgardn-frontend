import { useState } from "react";
import { CategoriesGrid, ServicesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { PaginationBar } from "@/components/shared/PaginationBar";
import {
  Badge,
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
  useAdminCategorieBySlug,
  useAdminServicesByCategorie,
} from "@/features/admin/categories/categories.query";
import {
  useCategorieBySlug,
  useServicesByCategorie,
} from "@/features/public/catalog/categories/categories.query";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Page d'affichage d'une categorie. Fonctionne en mode public et admin.
 * En mode admin (via NavigationContext), utilise les hooks admin sans filtres de statut.
 */
export function CategorieShowPage() {
  // Recuperation du slug de la categorie depuis les params d'URL
  const { slug } = useParams();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common", "admin"]);
  // Hook de navigation pour le bouton retour
  const navigate = useNavigate();
  // Recuperation du contexte de navigation (admin ou public)
  const { isAdmin } = useNavigationPaths();
  // Etat de la page courante pour la pagination des services
  const [page, setPage] = useState(1);
  // Les deux hooks sont appeles : null desactive le hook non utilise (enabled: !!slug)
  const publicCategorieQuery = useCategorieBySlug(isAdmin ? null : slug);
  // Hook admin : charge la categorie depuis l'API admin (tous statuts)
  const adminCategorieQuery = useAdminCategorieBySlug(isAdmin ? slug : null);
  // Selection de la requete active selon le contexte
  const categorieQuery = isAdmin ? adminCategorieQuery : publicCategorieQuery;
  // Hook public : charge les services de la categorie (statut publie uniquement)
  const publicServicesQuery = useServicesByCategorie(isAdmin ? null : slug, {
    page,
  });
  // Hook admin : charge les services de la categorie sans filtre de statut
  const adminServicesQuery = useAdminServicesByCategorie(
    isAdmin ? slug : null,
    { page },
  );
  // Selection de la requete de services active selon le contexte
  const servicesQuery = isAdmin ? adminServicesQuery : publicServicesQuery;
  // Destructuration des etats de la requete de la categorie
  const {
    data: categorie,
    isLoading,
    isError,
    error,
    refetch,
  } = categorieQuery;
  // Determination du code d'erreur pour afficher un message adapte
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
      <Card className="shadow-none rounded-none border-none bg-background">
        <CardHeader>
          <CardTitle>
            {title}
            {isAdmin && (
              <Badge
                className="mx-3"
                variant={categorie?.est_active ? "default" : "secondary"}
              >
                {t(
                  categorie?.est_active
                    ? "admin:categories.statuts.active"
                    : "admin:categories.statuts.inactive",
                )}
              </Badge>
            )}
          </CardTitle>
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
        paginationBar={
          (servicesQuery.data?.meta?.last_page ?? 0) > 1 ? (
            <PaginationBar
              currentPage={servicesQuery.data.meta.current_page}
              lastPage={servicesQuery.data.meta.last_page}
              onPageChange={setPage}
            />
          ) : null
        }
      />
    </div>
  );
}

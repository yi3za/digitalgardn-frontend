import { useState } from "react";
import { CompetencesGrid, ServicesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { PaginationBar } from "@/components/shared/PaginationBar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  DataLoading,
  DataError,
} from "@/components/ui";
import {
  useAdminCompetenceBySlug,
  useAdminServicesByCompetence,
} from "@/features/admin/competences/competences.query";
import {
  useCompetenceBySlug,
  useServicesByCompetence,
} from "@/features/public/catalog/competences/competences.query";
import { useNavigationPaths } from "@/contexts/NavigationContext";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Page d'affichage d'une competence. Fonctionne en mode public et admin.
 * En mode admin (via NavigationContext), utilise les hooks admin sans filtres de statut.
 */
export function CompetenceShowPage() {
  // Recuperation du slug de la competence depuis les params d'URL
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
  const publicCompetenceQuery = useCompetenceBySlug(isAdmin ? null : slug);
  // Hook admin : charge la competence depuis l'API admin (tous statuts)
  const adminCompetenceQuery = useAdminCompetenceBySlug(isAdmin ? slug : null);
  // Selection de la requete active selon le contexte
  const competenceQuery = isAdmin
    ? adminCompetenceQuery
    : publicCompetenceQuery;
  // Hook public : charge les services de la competence (statut publie uniquement)
  const publicServicesQuery = useServicesByCompetence(isAdmin ? null : slug, {
    page,
  });
  // Hook admin : charge les services de la competence sans filtre de statut
  const adminServicesQuery = useAdminServicesByCompetence(
    isAdmin ? slug : null,
    { page },
  );
  // Selection de la requete de services active selon le contexte
  const servicesQuery = isAdmin ? adminServicesQuery : publicServicesQuery;
  // Destructuration des etats de la requete de la competence
  const {
    data: competence,
    isLoading,
    isError,
    error,
    refetch,
  } = competenceQuery;
  // Determination du code d'erreur pour afficher un message adapte
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Les informations de la competence pour l'affichage
  const title = competence?.nom;
  const description =
    competence?.description ?? t("catalog:competences.description");
  // Les enfants de la competence pour l'affichage
  const children = competence?.enfants ?? [];

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
      <Card className="shadow-none border-none bg-background">
        <CardHeader>
          <CardTitle>
            {title}
            {isAdmin && (
              <Badge
                className="mx-3"
                variant={competence?.est_active ? "default" : "secondary"}
              >
                {t(
                  competence?.est_active
                    ? "admin:competences.statuts.active"
                    : "admin:competences.statuts.inactive",
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
            <CompetencesGrid competences={children} />
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

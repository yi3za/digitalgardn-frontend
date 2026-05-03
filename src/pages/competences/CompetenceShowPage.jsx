import { CompetencesGrid, ServicesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import {
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
  useCompetenceBySlug,
  useServicesByCompetence,
} from "@/features/public/catalog/competences/competences.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Page publique qui affiche les services d'une competence.
 * Si c'est un parent, affiche ses enfants en scroll horizontal + tous leurs services.
 * Si c'est un enfant, affiche uniquement ses propres services.
 */
export function CompetenceShowPage() {
  const { slug } = useParams();
  const { t } = useTranslation(["catalog", "common"]);
  const navigate = useNavigate();
  // Recupere la competence par slug avec ses enfants
  const competenceQuery = useCompetenceBySlug(slug);
  // Recupere les services de la competence (ou sous-competence) selectionnee
  const servicesQuery = useServicesByCompetence(slug);
  const {
    data: competence,
    isLoading,
    isError,
    error,
    refetch,
  } = competenceQuery;
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
            <CompetencesGrid competences={children} />
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

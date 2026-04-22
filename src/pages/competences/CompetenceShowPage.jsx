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
} from "@/components/ui";
import {
  useCompetences,
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
  const { t } = useTranslation("sections");
  const navigate = useNavigate();
  // Recupere toutes les competences pour trouver le nom et les enfants
  const competencesQuery = useCompetences();
  // Recupere les services de la competence (ou sous-competence) selectionnee
  const servicesQuery = useServicesByCompetence(slug);
  // Cherche d'abord parmi les parents, puis parmi les enfants
  const allCompetences = competencesQuery.data ?? [];
  const competence =
    allCompetences.find((c) => c.slug === slug) ??
    allCompetences.flatMap((c) => c.enfants ?? []).find((e) => e.slug === slug);
  // Les informations de la competence pour l'affichage
  const title = competence?.nom ?? `#${slug}`;
  const description = competence?.description ?? t("competences.description");
  // Les enfants de la competence pour l'affichage
  const children = competence?.enfants ?? [];

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
            <CompetencesGrid competences={children} linkTo="/competences" />
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

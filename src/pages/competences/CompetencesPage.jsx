import {
  CatalogItemsSection,
  CompetencesGrid,
} from "@/components/sections/catalog";
import { Button } from "@/components/ui";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Page publique qui affiche toutes les competences disponibles
 */
export function CompetencesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation("sections");
  const navigate = useNavigate();
  // Requete pour recuperer les competences publiques
  const competencesQuery = useCompetences();

  return (
    <CatalogItemsSection
      itemsQuery={competencesQuery}
      title={t("competences.title")}
      description={t("competences.description")}
      renderItems={(competences) => (
        <CompetencesGrid
          competences={competences}
          linkTo="/competences"
          variant="grid"
        />
      )}
      action={
        <Button type="button" variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft /> {t("common.back")}
        </Button>
      }
    />
  );
}

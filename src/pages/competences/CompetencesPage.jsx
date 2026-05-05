import { useState } from "react";
import { CompetencesGrid } from "@/components/catalog";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui";
import { useCompetences } from "@/features/public/catalog/competences/competences.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Configuration des filtres disponibles pour les competences
const COMPETENCES_FILTERS_CONFIG = [{ key: "search", type: "input" }];

/**
 * Page publique qui affiche toutes les competences disponibles
 */
export function CompetencesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["catalog", "common"]);
  const navigate = useNavigate();
  // Etat des filtres appliques
  const [filters, setFilters] = useState({});
  const handleApplyFilters = (newFilters) => setFilters(newFilters);
  // Requete pour recuperer les competences publiques
  const competencesQuery = useCompetences(filters);

  return (
    <QueryItemsSection
      itemsQuery={competencesQuery}
      title={t("catalog:competences.title")}
      description={t("catalog:competences.description")}
      renderItems={(competences) => (
        <CompetencesGrid competences={competences} variant="grid" />
      )}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={COMPETENCES_FILTERS_CONFIG}
          onApply={handleApplyFilters}
        />
      }
      action={
        <Button type="button" variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft /> {t("common:actions.back")}
        </Button>
      }
    />
  );
}

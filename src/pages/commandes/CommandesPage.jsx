import { CommandesGrid } from "@/components/commandes/CommandesGrid";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button } from "@/components/ui";
import { useCommandes } from "@/features/account/commandes/commandes.query";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Page publique qui affiche toutes les commandes disponibles
 */
export function CommandesPage({ dashboard = false }) {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["commandes", "common"]);
  const navigate = useNavigate();
  // Requete pour recuperer les commandes publiques
  const commandesQuery = useCommandes();

  return (
    <QueryItemsSection
      itemsQuery={commandesQuery}
      title={t("commandes:title")}
      description={t("commandes:description")}
      renderItems={(commandes) => (
        <CommandesGrid
          t={t}
          commandes={commandes}
          linkTo={dashboard ? "/dashboard/commandes" : "/commandes"}
        />
      )}
      action={
        <Button type="button" variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft /> {t("common:actions.back")}
        </Button>
      }
    />
  );
}

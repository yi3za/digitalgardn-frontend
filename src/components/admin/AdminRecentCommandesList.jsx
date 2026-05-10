import { useNavigate } from "react-router-dom";
import { RecentList } from "@/components/shared/RecentList";
import { CommandeItem } from "@/components/commandes/CommandeItem";
import { useNavigationPaths } from "@/contexts/NavigationContext";

/**
 * Liste des dernieres commandes recentes de la plateforme
 */
export function AdminRecentCommandesList({ t, commandes = [] }) {
  const navigate = useNavigate();
  const { commandes: commandesBasePath } = useNavigationPaths();

  return (
    <RecentList
      t={t}
      titleKey="admin:dashboard.activite.commandes.title"
      descriptionKey="admin:dashboard.activite.commandes.description"
      viewAllKey="admin:dashboard.activite.commandes.viewAll"
      emptyKey="admin:dashboard.activite.commandes.empty"
      linkTo={commandesBasePath}
      items={commandes}
      renderItem={(commande) => (
        <CommandeItem
          key={commande.id}
          item={commande}
          t={t}
          onClick={() => navigate(commandesBasePath)}
        />
      )}
    />
  );
}

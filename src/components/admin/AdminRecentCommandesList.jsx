import { useNavigate } from "react-router-dom";
import { AdminRecentList } from "./AdminRecentList";
import { CommandeItem } from "@/components/commandes/CommandeItem";

// Liste des dernieres commandes recentes de la plateforme (dashboard admin)
export function AdminRecentCommandesList({ t, commandes = [] }) {
  const navigate = useNavigate();

  return (
    <AdminRecentList
      t={t}
      titleKey="admin:dashboard.activite.commandes.title"
      descriptionKey="admin:dashboard.activite.commandes.description"
      viewAllKey="admin:dashboard.activite.commandes.viewAll"
      emptyKey="admin:dashboard.activite.commandes.empty"
      linkTo="/admin/commandes"
      items={commandes}
      renderItem={(commande) => (
        <CommandeItem
          key={commande.id}
          item={commande}
          t={t}
          onClick={() => navigate(`/admin/commandes`)}
        />
      )}
    />
  );
}

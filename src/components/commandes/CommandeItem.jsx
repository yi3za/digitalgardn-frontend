import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
  Badge,
} from "@/components/ui";
import {
  commandeStatusBadgeVariantByStatut,
  commandeStatusTextKeyByStatut,
} from "@/features/account/commandes/commandes.status";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche une commande individuelle
 */
export function CommandeItem({ item, linkTo = "/commandes", t }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Navigation vers la page commande
  const handleClick = () => {
    navigate(`${linkTo}/${item.id}`);
  };

  return (
    <Item
      asChild
      className="min-w-50 cursor-pointer overflow-hidden"
      variant="outline"
    >
      <button onClick={handleClick}>
        <ItemContent>
          <ItemTitle>{item?.service?.titre}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Badge variant={commandeStatusBadgeVariantByStatut?.[item?.statut]}>
            {t(commandeStatusTextKeyByStatut?.[item?.statut])}
          </Badge>
        </ItemActions>
      </button>
    </Item>
  );
}

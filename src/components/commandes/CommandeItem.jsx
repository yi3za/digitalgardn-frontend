import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
  Badge,
  ItemDescription,
  ItemFooter,
} from "@/components/ui";
import {
  commandeStatusBadgeVariantByStatut,
  commandeStatusTextKeyByStatut,
} from "@/features/account/commandes/commandes.status";
import { useNavigate } from "react-router-dom";
import { AvatarIdentity } from "../shared/AvatarIdentity";
import { Send } from "lucide-react";

/**
 * Composant qui affiche une commande individuelle
 */
export function CommandeItem({ item, linkTo = "/commandes", t }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Gestion du clic sur la commande pour acceder a la conversation liee
  const handleClick = (e) => {
    // Naviguer vers la page de la conversation
    navigate(linkTo, {
      state: { conversationId: item?.conversation?.id },
    });
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
          <ItemDescription className="text-start line-clamp-1">
            {item?.service?.description}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant={commandeStatusBadgeVariantByStatut?.[item?.statut]}>
            {t(commandeStatusTextKeyByStatut?.[item?.statut])}
          </Badge>
        </ItemActions>
        <ItemFooter className="justify-start gap-3">
          <AvatarIdentity user={item?.client} />
          <Send color="gray" />
          <AvatarIdentity user={item?.freelance} />
        </ItemFooter>
      </button>
    </Item>
  );
}

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
import { formatDateTime } from "@/lib/utils";

/**
 * Composant qui affiche une commande individuelle
 */
export function CommandeItem({ item, linkTo, t }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Gestion du clic sur la commande pour acceder a la conversation liee
  const handleClick = () => {
    navigate(linkTo, {
      state: { conversationId: item?.conversation?.id },
    });
  };

  return (
    <Item
      onClick={handleClick}
      className="min-w-50 cursor-pointer overflow-hidden"
      variant="outline"
    >
      <ItemContent>
        <ItemTitle>{item?.service?.titre}</ItemTitle>
        <ItemDescription className="text-start line-clamp-1">
          {item?.service?.description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col">
        <Badge variant={commandeStatusBadgeVariantByStatut?.[item?.statut]}>
          {t(commandeStatusTextKeyByStatut?.[item?.statut])}
        </Badge>
        {item?.updated_at && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(item.updated_at)}
          </span>
        )}
      </ItemActions>
      <ItemFooter className="justify-start gap-3 flex-col sm:flex-row">
        <AvatarIdentity user={item?.client} />
        <Send color="gray" />
        <AvatarIdentity user={item?.freelance} />
      </ItemFooter>
    </Item>
  );
}

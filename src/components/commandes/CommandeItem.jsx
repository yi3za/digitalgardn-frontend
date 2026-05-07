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
  COMMANDE_STATUS,
  commandeStatusBadgeVariantByStatut,
  commandeStatusTextKeyByStatut,
} from "@/features/account/commandes/commandes.status";
import { useNavigate } from "react-router-dom";
import { AvatarIdentity } from "../shared/AvatarIdentity";
import { Send } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { CommandePdfExporter } from "./CommandePdfExporter";

/**
 * Composant qui affiche une commande individuelle
 */
export function CommandeItem({ item, linkTo, t, onClick = null }) {
  // Hook de navigation
  const navigate = useNavigate();
  // onClick personnalise ou navigation vers la conversation liee par defaut
  const handleClick =
    onClick ??
    (() => {
      navigate(linkTo, {
        state: { conversationId: item?.conversation?.id },
      });
    });

  return (
    <Item onClick={handleClick} className="cursor-pointer" variant="outline">
      <ItemContent>
        <ItemTitle>
          {item?.service?.titre}
          <Badge
            className="mx-3"
            variant={commandeStatusBadgeVariantByStatut?.[item?.statut]}
          >
            {t(commandeStatusTextKeyByStatut?.[item?.statut])}
          </Badge>
        </ItemTitle>
        <ItemDescription className="text-start line-clamp-1">
          {item?.service?.description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col items-end">
        {item?.statut === COMMANDE_STATUS.TERMINEE && (
          <CommandePdfExporter t={t} commande={item} />
        )}
        {item?.updated_at && (
          <span className="font-medium text-xs text-muted-foreground">
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

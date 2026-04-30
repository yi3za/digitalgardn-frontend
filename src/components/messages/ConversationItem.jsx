import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  NotificationBadge,
} from "@/components/ui";
import {
  commandeStatusBadgeVariantByStatut,
  commandeStatusTextKeyByStatut,
} from "@/features/account/commandes/commandes.status";
import { cn, formatClockTime, getFallbackName } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUnreadMessagesByConversation } from "@/features/notifications/notifications.selectores";
import { setConversationMessages } from "@/features/notifications/notificationsSlice";

/**
 * Composant affichant un item de conversation dans la liste des conversations
 */
export function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onSelect,
}) {
  const { t } = useTranslation(["messages", "commandes"]);
  // Determination de l'interlocuteur (peer) dans la conversation, pour afficher son nom et avatar
  const isSender = conversation?.sender_id === currentUserId;
  // Dispatcher pour les actions Redux
  const dispatch = useDispatch();
  // L'interlocuteur est celui qui n'est pas l'expediteur actuel
  const peer = isSender ? conversation?.receiver : conversation?.sender;
  // Recuperation du dernier message de la conversation pour afficher un apercu dans la liste
  const latestMessage = conversation?.latest_message;
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'interlocuteur
  const fallbackName = getFallbackName(peer?.name ?? peer?.username ?? "?");
  // Contenu de l'aperçu : le contenu du dernier message ou un message par défaut si aucun message n'existe
  const preview = latestMessage?.content || t("conversation.emptyPreview");
  // Formatage de l'heure du dernier message pour l'affichage
  const time = formatClockTime(latestMessage?.created_at);
  // Recuperation de la commande liee a la conversation
  const commande = conversation?.commande ?? null;
  // Nombre de messages non lus dans cette conversation pour l'utilisateur courant
  const unreadMessagesCount = useSelector(
    selectUnreadMessagesByConversation(conversation?.id),
  );
  // Fonction de gestion du clic sur la conversation
  const handleClick = () => {
    onSelect(conversation?.id);
    if (isActive) return;
    dispatch(
      setConversationMessages({ conversationId: conversation?.id, count: 0 }),
    );
  };

  return (
    <Item
      asChild
      variant="outline"
      className={cn(
        "cursor-pointer text-left transition break-all relative mt-2",
        "hover:bg-muted/40",
        isActive && "border-primary bg-primary/5",
      )}
    >
      <button type="button" onClick={handleClick} className="w-full min-w-0">
        <NotificationBadge count={unreadMessagesCount} />
        <ItemMedia>
          <Avatar>
            <AvatarImage src={peer?.avatar_url} alt={peer?.username} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle className="line-clamp-1">{peer?.name}</ItemTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {time}
            </span>
          </ItemHeader>
          <ItemDescription className="line-clamp-1">{preview}</ItemDescription>
        </ItemContent>
        {commande && (
          <>
            <ItemSeparator />
            <ItemFooter>
              <ItemTitle className="line-clamp-1">
                {commande?.service?.titre}
              </ItemTitle>
              <Badge
                variant={commandeStatusBadgeVariantByStatut?.[commande?.statut]}
              >
                {t(commandeStatusTextKeyByStatut?.[commande?.statut])}
              </Badge>
            </ItemFooter>
          </>
        )}
      </button>
    </Item>
  );
}

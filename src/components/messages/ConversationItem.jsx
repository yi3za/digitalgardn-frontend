import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { getFallbackName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Formatage de la date du dernier message pour l'affichage dans la liste des conversations
const formatConversationTime = (date, locale) => {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

/**
 * Composant affichant un item de conversation dans la liste des conversations
 */
export function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onSelect,
}) {
  const { t, i18n } = useTranslation("messages");
  // Determination de l'interlocuteur (peer) dans la conversation, pour afficher son nom et avatar
  const isSender = conversation?.sender_id === currentUserId;
  // L'interlocuteur est celui qui n'est pas l'expediteur actuel
  const peer = isSender ? conversation?.receiver : conversation?.sender;
  // Recuperation du dernier message de la conversation pour afficher un apercu dans la liste
  const latestMessage = conversation?.latest_message;
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'interlocuteur
  const fallbackName = getFallbackName(peer?.name ?? peer?.username ?? "?");
  // Contenu de l'aperçu : le contenu du dernier message ou un message par défaut si aucun message n'existe
  const preview = latestMessage?.content || t("conversation.emptyPreview");
  // Formatage de l'heure du dernier message pour l'affichage
  const time = formatConversationTime(
    conversation?.last_message_at ?? latestMessage?.created_at,
    i18n.language,
  );

  return (
    <Item
      asChild
      variant="outline"
      className={cn(
        "w-full min-w-0 cursor-pointer text-left transition-colors break-all",
        "hover:bg-muted/40",
        isActive && "border-primary bg-primary/5",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        className="w-full min-w-0"
      >
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
      </button>
    </Item>
  );
}

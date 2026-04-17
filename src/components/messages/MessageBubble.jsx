import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cn, getFallbackName } from "@/lib/utils";

// Formatage de la date d'un message pour l'affichage dans la bulle de message
const formatMessageTime = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

/**
 * Composant affichant une bulle de message dans la conversation
 */
export function MessageBubble({ message, isOwn }) {
  // Determination de l'expediteur du message pour afficher son avatar et nom dans le cas des messages recus
  const sender = message?.sender;
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'expediteur
  const fallbackName = getFallbackName(sender?.name ?? sender?.username ?? "?");

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      {!isOwn && (
        <Avatar size="sm" className="mt-1">
          <AvatarImage src={sender?.avatar_url} alt={sender?.username} />
          <AvatarFallback>{fallbackName}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          isOwn
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted",
        )}
      >
        <p className="wrap-break-word">{message.content}</p>
        <p
          className={cn(
            "mt-1 text-right text-[11px]",
            isOwn ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {formatMessageTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

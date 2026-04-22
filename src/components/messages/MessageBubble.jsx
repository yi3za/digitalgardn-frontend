import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cn, formatClockTime, getFallbackName } from "@/lib/utils";

/**
 * Composant affichant une bulle de message dans la conversation
 */
export function MessageBubble({ message, isOwn }) {
  // Determination de l'expediteur du message pour afficher son avatar et nom dans le cas des messages recus
  const sender = message?.sender;
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'expediteur
  const fallbackName = getFallbackName(sender?.name);

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
          "max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          isOwn
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted",
        )}
      >
        <p className="break-all whitespace-pre-line">{message.content}</p>
        <p
          className={cn(
            "mt-1 text-right text-muted",
            isOwn ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {formatClockTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

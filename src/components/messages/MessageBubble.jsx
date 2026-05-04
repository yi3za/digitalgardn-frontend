import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cn, formatClockTime, getFallbackName } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

/**
 * Composant affichant une bulle de message dans la conversation
 */
export function MessageBubble({ message, isOwn }) {
  // Determination de l'expediteur du message pour afficher son avatar et nom dans le cas des messages recus
  const sender = message?.sender;
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'expediteur
  const fallbackName = getFallbackName(sender?.name);
  // Indication si le message contient un fichier joint
  const hasFichier = !!message?.fichier_url;

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
        {hasFichier && (
          <a
            href={message.fichier_url}
            download={message.fichier_nom}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 mb-2 transition-colors",
              isOwn
                ? "border-primary-foreground/30 hover:bg-primary-foreground/10"
                : "border-border hover:bg-accent",
            )}
          >
            <FileText className="size-4 shrink-0" />
            <span className="break-all text-xs font-medium">
              {message.fichier_nom}
            </span>
            <Download className="size-4 shrink-0 opacity-70" />
          </a>
        )}
        {message.content && (
          <p className="break-all whitespace-pre-line">{message.content}</p>
        )}
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

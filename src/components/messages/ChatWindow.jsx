import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataEmpty,
  DataError,
  DataLoading,
  ScrollArea,
  Separator,
} from "@/components/ui";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { getFallbackName } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Composant affichant la fenetre de chat pour une conversation donnee
 */
export function ChatWindow({
  conversation,
  messages = [],
  isLoading,
  isError,
  onRefetch,
  onSend,
  isSending,
  currentUserId,
}) {
  // Hook de traduction pour les textes statiques du composant
  const { t } = useTranslation("messages");
  // Ref pour faire defiler la fenetre de chat vers le bas
  const bottomRef = useRef(null);
  // Determination de l'interlocuteur dans la conversation pour afficher son avatar et nom
  const peer = useMemo(() => {
    if (!conversation) return null;
    return conversation.sender_id === currentUserId
      ? conversation.receiver
      : conversation.sender;
  }, [conversation, currentUserId]);
  // Effet pour faire defiler la fenetre de chat vers le bas a chaque changement de messages ou de conversation
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, conversation?.id]);
  // Si aucune conversation n'est selectionnee, afficher un message d'invite a selectionner une conversation
  if (!conversation) {
    return <DataEmpty description={t("chat.selectConversation")} />;
  }

  return (
    <Card className="w-full min-w-0 h-[50vh] lg:h-full flex flex-col shadow-none overflow-hidden">
      <CardHeader className="flex gap-3 items-center shrink-0">
        <Avatar className="size-10">
          <AvatarImage src={peer.avatar_url} alt={peer.name} />
          <AvatarFallback>
            {getFallbackName(peer?.name || peer?.username) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {peer?.name || peer?.username || t("conversation.unknownUser")}
          </CardTitle>
          <CardDescription>{t("chat.active")}</CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-hidden flex-1 min-h-0 flex">
        {isLoading ? (
          <DataLoading />
        ) : isError ? (
          <DataError
            retryText={t("common:actions.retry")}
            onRetry={onRefetch}
          />
        ) : messages.length === 0 ? (
          <DataEmpty className="min-h-55" description={t("chat.empty")} />
        ) : (
          <ScrollArea className="h-full px-5">
            <div className="space-y-3">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === currentUserId}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="shrink-0">
        <MessageInput
          onSend={onSend}
          isSending={isSending}
          disabled={isLoading || isError}
        />
      </CardFooter>
    </Card>
  );
}

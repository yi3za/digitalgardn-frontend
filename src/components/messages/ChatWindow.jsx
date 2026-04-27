import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DataEmpty,
  DataError,
  DataLoading,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
  ScrollArea,
  Separator,
} from "@/components/ui";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { getFallbackName } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  COMMANDE_STATUS,
  commandeStatusBadgeVariantByStatut,
  commandeStatusTextKeyByStatut,
} from "@/features/account/commandes/commandes.status";
import { Link } from "react-router-dom";
import { CommandeDropDownMenu } from "../commandes/CommandeDropDownMenu";

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
  const { t } = useTranslation(["messages", "commandes", "codes"]);
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
  // Recuperation du commande liee a la conversation
  const commande = conversation?.commande ?? null;
  // Determination si l'utilisateur actuel est le vendeur dans la commande liee a la conversation
  const isVendeur = commande?.service?.user_id === currentUserId;
  // Determination de l'etat de la commande pour adapter l'affichage et les actions disponibles dans la fenetre de chat
  const isCancelled = commande?.statut === COMMANDE_STATUS.ANNULEE;
  const isCompleted = commande?.statut === COMMANDE_STATUS.TERMINEE;
  const isInReview = commande?.statut === COMMANDE_STATUS.EN_REVISION;
  const isDelivered = commande?.statut === COMMANDE_STATUS.LIVREE;
  // Si aucune conversation n'est selectionnee, afficher un message d'invite a selectionner une conversation
  if (!conversation) {
    return <DataEmpty description={t("chat.selectConversation")} />;
  }

  return (
    <Card className="h-[50vh] lg:h-full flex flex-col shadow-none overflow-hidden">
      <CardHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="size-10">
            <AvatarImage src={peer.avatar_url} alt={peer.name} />
            <AvatarFallback>
              {getFallbackName(peer?.name || peer?.username) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="line-clamp-1">
              {peer?.name || peer?.username || t("conversation.unknownUser")}
            </CardTitle>
            <CardDescription>{t("chat.active")}</CardDescription>
          </div>
        </div>
        {commande && (
          <>
            <Item className="p-0">
              <ItemSeparator />
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  {commande?.service?.titre}
                </ItemTitle>
                <ItemDescription>
                  {t("chat.reviews", {
                    used: commande?.revisions_utilisees,
                    max: commande?.service?.revisions,
                    remaining:
                      commande?.service?.revisions -
                      commande?.revisions_utilisees,
                  })}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge
                  asChild
                  variant={
                    commandeStatusBadgeVariantByStatut?.[commande?.statut]
                  }
                >
                  <Link to={`/services/${commande?.service?.slug}`}>
                    {t(commandeStatusTextKeyByStatut?.[commande?.statut])}
                  </Link>
                </Badge>
              </ItemActions>
            </Item>
            {((!isCancelled && !isCompleted && !isInReview && !isDelivered) ||
              (isVendeur && isInReview) ||
              (!isVendeur && isDelivered)) && (
              <CardAction>
                <CommandeDropDownMenu
                  t={t}
                  commande={commande}
                  isVendeur={isVendeur}
                />
              </CardAction>
            )}
          </>
        )}
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
          <DataEmpty description={t("chat.empty")} />
        ) : (
          <ScrollArea className="h-full w-full px-5">
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

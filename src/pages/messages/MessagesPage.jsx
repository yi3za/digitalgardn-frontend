import { ChatWindow } from "@/components/messages/ChatWindow";
import { ConversationList } from "@/components/messages/ConversationList";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSendMessage } from "@/features/messages/messages.mutations";
import { getEcho, isRealtimeEnabled } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import {
  useConversationMessages,
  useConversations,
} from "@/features/messages/messages.query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

/**
 * MessagesPage : page principale de la messagerie, affichant la liste des conversations et les messages d'une conversation selectionnee
 */
export function MessagesPage() {
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation("messages");
  // Client de requete pour invalider les queries lors de la reception de nouveaux messages en temps reel
  const queryClient = useQueryClient();
  // Determination si la fonctionnalite de messagerie en temps reel est active pour adapter le comportement de chargement des conversations et messages
  const realtimeActive = isRealtimeEnabled();
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // ID de l'utilisateur connecte pour determiner les messages envoyes et recus
  const currentUserId = user?.id;
  // ID de la conversation actuellement selectionnee
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  // Recuperation de la liste des conversations de l'utilisateur
  const conversationsQuery = useConversations(!realtimeActive);
  const conversations = conversationsQuery.data ?? [];
  // Conversation actuellement selectionnee
  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? null,
    [conversations, selectedConversationId],
  );
  // Recuperation des messages de la conversation selectionnee
  const messagesQuery = useConversationMessages(
    selectedConversationId,
    !realtimeActive,
  );
  // Messages de la conversation selectionnee
  const messages = messagesQuery.data ?? [];
  // Mutation pour envoyer un message dans la conversation selectionnee
  const sendMessageMutation = useSendMessage();
  // Fonction d'envoi de message, utilisee par le composant ChatWindow
  const sendMessage = async (content) => {
    if (!selectedConversationId) return;
    // Envoi du message via la mutation
    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      data: { content },
    });
  };
  // Abonnement realtime sur toutes les conversations chargees.
  useEffect(() => {
    if (!currentUserId || conversations.length === 0) return;
    const echo = getEcho();
    if (!echo) return;
    const conversationIds = conversations.map(
      (conversation) => conversation.id,
    );
    // S'abonner a chaque canal de conversation pour ecouter les nouveaux messages
    const unsubs = conversationIds.map((conversationId) => {
      // S'abonner au canal prive de la conversation
      const channel = echo.private(`conversations.${conversationId}`);
      // Ecouter l'evenement de nouveau message dans la conversation
      channel.listen(".message.sent", (payload) => {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
        // Si le message concerne la conversation actuellement selectionnee, invalider aussi les messages de cette conversation pour les recharger
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversation", payload?.conversation_id],
        });
      });
      // Retourner une fonction de desabonnement pour ce canal
      return () => {
        channel.stopListening(".message.sent");
      };
    });
    // Nettoyer les abonnements et quitter les canaux a la destruction du composant ou au changement de conversations
    return () => {
      unsubs.forEach((unsubscribe) => unsubscribe());
      conversationIds.forEach((conversationId) => {
        echo.leave(`conversations.${conversationId}`);
      });
    };
  }, [conversations, currentUserId, queryClient]);

  return (
    <section className="py-5 flex flex-col h-[calc(100vh-4rem)]">
      <Card className="shadow-none border-none flex flex-col flex-1 min-h-0 gap-3">
        <CardHeader>
          <CardTitle>{t("page.title")}</CardTitle>
          <CardDescription>{t("page.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          <aside className="flex flex-col overflow-hidden rounded-xl border bg-card p-3">
            <ConversationList
              conversations={conversations}
              isLoading={conversationsQuery.isLoading}
              isError={conversationsQuery.isError}
              onRefetch={conversationsQuery.refetch}
              selectedConversationId={selectedConversationId}
              onSelect={setSelectedConversationId}
              currentUserId={currentUserId}
            />
          </aside>
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            isLoading={messagesQuery.isLoading}
            isError={messagesQuery.isError}
            onRefetch={messagesQuery.refetch}
            onSend={sendMessage}
            isSending={sendMessageMutation.isPending}
            currentUserId={currentUserId}
          />
        </CardContent>
      </Card>
    </section>
  );
}

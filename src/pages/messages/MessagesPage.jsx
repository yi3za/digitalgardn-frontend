import { ChatWindow } from "@/components/messages/ChatWindow";
import { ConversationList } from "@/components/messages/ConversationList";
import { authSelector } from "@/features/auth/auth.selectors";
import { useSendMessage } from "@/features/messages/messages.mutations";
import { useRealtimeSubscriptions } from "@/features/messages/useRealtimeSubscriptions";
import { isRealtimeEnabled } from "@/lib/echo";
import {
  useConversationMessages,
  useConversations,
} from "@/features/messages/messages.query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
  // Etat de navigation pour preselectionner une conversation au premier chargement
  const location = useLocation();
  // Determination si la fonctionnalite de messagerie en temps reel est active pour adapter le comportement de chargement des conversations et messages
  const realtimeActive = isRealtimeEnabled();
  // Recuperation de l'utilisateur connecte
  const { user } = useSelector(authSelector);
  // ID de l'utilisateur connecte pour determiner les messages envoyes et recus
  const currentUserId = user?.id;
  // Conversation transmise depuis une autre page (ex: bouton contacter d'un service)
  const initialConversationIdFromState = Number(location.state?.conversationId);
  // ID de la conversation actuellement selectionnee
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  // Etat interne pour ne consommer l'ID initial qu'une seule fois
  const [pendingInitialConversationId, setPendingInitialConversationId] =
    useState(
      Number.isFinite(initialConversationIdFromState) &&
        initialConversationIdFromState > 0
        ? initialConversationIdFromState
        : null,
    );
  // Recuperation de la liste des conversations de l'utilisateur
  const conversationsQuery = useConversations(!realtimeActive);
  const conversations = conversationsQuery.data ?? [];
  // Liste stable des IDs de conversations pour eviter de reabonner inutilement quand seule la reference du tableau change
  const conversationIds = useMemo(
    () =>
      conversations
        .map((conversation) => Number(conversation.id))
        .filter((id) => Number.isFinite(id))
        .sort((a, b) => a - b),
    [conversations],
  );
  // Gerer les abonnements en temps reel aux conversations et nouvelles conversations
  useRealtimeSubscriptions(conversationIds, currentUserId);
  // Preselectionner la conversation transmise des qu'elle est disponible dans la liste
  useEffect(() => {
    // Si il n'y a pas de conversation a preselectionner ou pas de conversations chargees, ne rien faire
    if (!pendingInitialConversationId || conversations.length === 0) return;
    // Verifier que la conversation a preselectionner est bien dans la liste
    const hasInitialConversation = conversations.some(
      (conversation) =>
        Number(conversation.id) === pendingInitialConversationId,
    );
    // Si la conversation a preselectionner n'est pas dans la liste, ne rien faire
    if (!hasInitialConversation) return;
    // Sinon, preselectionner la conversation et vider l'etat de conversation en attente
    setSelectedConversationId(pendingInitialConversationId);
    setPendingInitialConversationId(null);
  }, [conversations, pendingInitialConversationId]);
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

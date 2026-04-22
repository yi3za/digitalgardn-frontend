import { ConversationItem } from "./ConversationItem";
import { DataEmpty, DataError, DataLoading, ScrollArea } from "@/components/ui";
import { useTranslation } from "react-i18next";

/**
 * Composant affichant la liste des conversations de l'utilisateur, avec gestion des etats de chargement et d'erreur
 */
export function ConversationList({
  conversations = [],
  isLoading,
  isError,
  errorCode,
  onRefetch,
  selectedConversationId,
  onSelect,
  currentUserId,
}) {
  // Hook de traduction pour les textes statiques du composant
  const { t } = useTranslation("messages");
  // Gestion des etats de chargement, d'erreur et de liste vide
  if (isLoading) {
    return <DataLoading />;
  }
  // Gestion de l'etat d'erreur lors du chargement des conversations
  if (isError) {
    return (
      <DataError
        errorCode={errorCode}
        retryText={t("common:actions.retry")}
        onRetry={onRefetch}
      />
    );
  }
  // Gestion de l'etat de liste vide lorsque l'utilisateur n'a aucune conversation
  if (conversations.length === 0) {
    return <DataEmpty description={t("list.empty")} />;
  }

  return (
    <ScrollArea className="h-full w-full p-3">
      <div className="space-y-2 pr-2 min-w-0">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            currentUserId={currentUserId}
            isActive={selectedConversationId === conversation.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

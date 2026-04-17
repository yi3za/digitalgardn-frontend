import { ConversationItem } from "./ConversationItem";
import {
  CustomAlert,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  ScrollArea,
  Skeleton,
} from "@/components/ui";
import { AlertCircle, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Composant affichant la liste des conversations de l'utilisateur, avec gestion des etats de chargement et d'erreur
 */
export function ConversationList({
  conversations = [],
  isLoading,
  isError,
  onRefetch,
  selectedConversationId,
  onSelect,
  currentUserId,
}) {
  // Hook de traduction pour les textes statiques du composant
  const { t } = useTranslation("messages");
  // Gestion des etats de chargement, d'erreur et de liste vide
  if (isLoading) {
    return <Skeleton className="h-full" />;
  }
  // Gestion de l'etat d'erreur lors du chargement des conversations
  if (isError) {
    return (
      <CustomAlert
        icon={AlertCircle}
        variant="destructive"
        header={t("list.loadingError")}
        body={null}
        refreshText={t("actions.refresh")}
        onRefetch={onRefetch}
      />
    );
  }
  // Gestion de l'etat de liste vide lorsque l'utilisateur n'a aucune conversation
  if (conversations.length === 0) {
    return (
      <Empty className="min-h-55 border">
        <EmptyHeader>
          <Inbox className="size-8 text-muted-foreground" />
          <EmptyTitle>{t("list.empty")}</EmptyTitle>
          <EmptyDescription />
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-2">
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

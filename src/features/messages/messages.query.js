import { useQuery } from "@tanstack/react-query";
import { getConversationMessages, getConversations } from "./messages.api";

// Hook pour recuperer la liste des conversations
export const useConversations = (usePolling = false, currentUserId) =>
  useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: getConversations,
    refetchInterval: usePolling ? 10000 : false,
    enabled: !!currentUserId,
  });

// Hook pour recuperer les messages d'une conversation
export const useConversationMessages = (conversationId, usePolling = false) =>
  useQuery({
    queryKey: ["messages", "conversation", conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: usePolling && conversationId ? 4000 : false,
  });

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation, sendMessage } from "./messages.api";

// Hook pour creer une conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    },
  });
};

// Hook pour envoyer un message dans une conversation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, data }) => sendMessage(conversationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", variables.conversationId],
      });
    },
  });
};

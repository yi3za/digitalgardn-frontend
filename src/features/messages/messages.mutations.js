import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  sendMessage,
  sendMessageFile,
} from "./messages.api";

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

// Hook pour envoyer un fichier joint dans une conversation
export const useSendMessageFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // variables : { conversationId, fichier, content? }
    mutationFn: ({ conversationId, fichier, content }) =>
      sendMessageFile(conversationId, { fichier, content }),
    onSuccess: (_, variables) => {
      // Actualiser la liste des conversations et les messages de la conversation courante
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", variables.conversationId],
      });
    },
  });
};

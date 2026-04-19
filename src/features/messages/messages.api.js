import { client } from "@/api/client";

// Configuration des en-tetes pour les requetes JSON
const contentTypeJson = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Fonction utilitaire pour extraire les details d'une reponse API
const unwrapDetails = (response) => response?.data?.details ?? {};

// Recuperer toutes les conversations de l'utilisateur connecte
export const getConversations = async () => {
  const response = await client.get("/api/me/conversations");
  const details = unwrapDetails(response);
  return details?.conversations ?? [];
};

// Creer ou recuperer une conversation existante avec un destinataire
export const createConversation = async (data) => {
  const response = await client.post(
    "/api/me/conversations",
    data,
    contentTypeJson,
  );
  const details = unwrapDetails(response);
  return details?.conversation ?? null;
};

// Recuperer les messages d'une conversation
export const getConversationMessages = async (conversationId) => {
  const response = await client.get(
    `/api/me/conversations/${conversationId}/messages`,
  );
  const details = unwrapDetails(response);
  return details?.messages ?? [];
};

// Envoyer un message dans une conversation
export const sendMessage = async (conversationId, data) => {
  const response = await client.post(
    `/api/me/conversations/${conversationId}/messages`,
    data,
    contentTypeJson,
  );
  const details = unwrapDetails(response);
  return details?.message ?? null;
};

import { client, contentTypeJson } from "@/api/client";

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

// Envoyer un fichier joint dans une conversation (multipart/form-data)
export const sendMessageFile = async (conversationId, { fichier, content }) => {
  // Construire un FormData car le backend attend multipart pour les fichiers
  const formData = new FormData();
  // Ajouter le fichier obligatoire
  formData.append("fichier", fichier);
  // Ajouter le contenu texte optionnel s'il est present
  if (content?.trim()) formData.append("content", content.trim());
  const response = await client.post(
    `/api/me/conversations/${conversationId}/messages`,
    formData,
  );
  const details = unwrapDetails(response);
  return details?.message ?? null;
};

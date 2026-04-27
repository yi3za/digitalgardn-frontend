import { useConversations } from "@/features/messages/messages.query";
import { getEcho, isRealtimeEnabled } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";

/**
 * useRealtimeSubscriptions :
 * hook de gestion des abonnements en temps reel
 */
export function useRealtimeSubscriptions(currentUserId) {
  // Client React Query pour invalider le cache
  const queryClient = useQueryClient();
  // Indique si le mode temps reel est actif
  const realtimeActive = isRealtimeEnabled();
  // Recuperation de la liste des conversations de l'utilisateur
  const conversationsQuery = useConversations(!realtimeActive, currentUserId);
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
  // Cle stable des ids de conversations
  const conversationIdsKey = useMemo(
    () =>
      conversationIds
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))
        .sort((a, b) => a - b)
        .join(","),
    [conversationIds],
  );
  // Liste stable des IDs de commandes liees aux conversations
  const commandeIds = useMemo(() => {
    const ids = conversations
      .map((conversation) => conversation.commande?.id)
      .filter((id) => Number.isFinite(id))
      .sort((a, b) => a - b);
    return ids;
  }, [conversations]);
  // Cle stable des ids de commandes
  const commandeIdsKey = useMemo(
    () =>
      commandeIds
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))
        .sort((a, b) => a - b)
        .join(","),
    [commandeIds],
  );
  // Abonnement realtime unique: messages des conversations + nouvelles conversations
  useEffect(() => {
    if (!realtimeActive || !currentUserId) return;
    // Instance Echo pour gerer les canaux websocket
    const echo = getEcho();
    if (!echo) return;
    // Convertit les cles en tableau d ids numeriques
    const conversationIds = conversationIdsKey
      ? conversationIdsKey.split(",").map((id) => Number(id))
      : [];
    const commandeIds = commandeIdsKey
      ? commandeIdsKey.split(",").map((id) => Number(id))
      : [];
    // S'abonner a chaque canal de conversation pour ecouter les nouveaux messages
    conversationIds.forEach((conversationId) => {
      const channel = echo.private(`conversations.${conversationId}`);
      // Ecoute de l'evenement de nouveau message dans la conversation pour rafraichir les donnees associees
      channel.listen(".message.sent", (payload) => {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversation", payload?.conversation_id],
        });
      });
    });
    // S'abonner a chaque canal de commande pour ecouter les mises a jour de statut
    commandeIds.forEach((commandeId) => {
      const channel = echo.private(`commandes.${commandeId}`);
      // Ecoute de l'evenement de mise a jour du statut dans la commande pour raf   raichir les donnees associees
      channel.listen(".status.updated", () => {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["portefeuille"],
        });
        queryClient.invalidateQueries({
          queryKey: ["portefeuille", "transactions"],
        });
      });
    });
    // Canal utilisateur pour les nouvelles conversations
    const userChannel = echo.private(`users.${currentUserId}`);
    // Ecoute la creation de conversation pour rafraichir la liste
    userChannel.listen(".conversation.created", () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    });
    // Quitte les canaux de cette page
    return () => {
      conversationIds.forEach((conversationId) => {
        echo.leave(`conversations.${conversationId}`);
      });
      commandeIds.forEach((commandeId) => {
        echo.leave(`commandes.${commandeId}`);
      });
      echo.leave(`users.${currentUserId}`);
    };
  }, [
    conversationIdsKey,
    commandeIdsKey,
    currentUserId,
    queryClient,
    realtimeActive,
  ]);
}

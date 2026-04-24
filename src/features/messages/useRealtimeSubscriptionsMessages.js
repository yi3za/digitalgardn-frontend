import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho, isRealtimeEnabled } from "@/lib/echo";

/**
 * Hook pour gerer les abonnements en temps reel pour les conversations
 */
export function useRealtimeSubscriptionsMessages(
  conversationIds = [],
  currentUserId,
) {
  // Client React Query pour invalider le cache
  const queryClient = useQueryClient();
  // Indique si le mode temps reel est actif
  const realtimeActive = isRealtimeEnabled();
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
  // Abonnement realtime unique: messages des conversations + nouvelles conversations
  useEffect(() => {
    if (!realtimeActive || !currentUserId) return;
    // Instance Echo pour gerer les canaux websocket
    const echo = getEcho();
    if (!echo) return;
    // Convertit la cle en tableau d ids numeriques
    const ids = conversationIdsKey
      ? conversationIdsKey.split(",").map((id) => Number(id))
      : [];
    // S'abonner a chaque canal de conversation pour ecouter les nouveaux messages
    ids.forEach((conversationId) => {
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
      ids.forEach((conversationId) => {
        echo.leave(`conversations.${conversationId}`);
      });
      echo.leave(`users.${currentUserId}`);
    };
  }, [conversationIdsKey, currentUserId, queryClient, realtimeActive]);
}

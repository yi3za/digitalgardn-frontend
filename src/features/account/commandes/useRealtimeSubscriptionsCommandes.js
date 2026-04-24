import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho, isRealtimeEnabled } from "@/lib/echo";

/**
 * Hook pour gerer les abonnements en temps reel pour les commandes
 */
export function useRealtimeSubscriptionsCommandes(
  commandeIds = [],
  currentUserId,
) {
  // Client React Query pour invalider le cache
  const queryClient = useQueryClient();
  // Indique si le mode temps reel est actif
  const realtimeActive = isRealtimeEnabled();
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
  // Abonnement realtime unique: commandes + nouvelles commandes
  useEffect(() => {
    if (!realtimeActive || !currentUserId) return;
    // Instance Echo pour gerer les canaux websocket
    const echo = getEcho();
    if (!echo) return;
    // Convertit la cle en tableau d ids numeriques
    const ids = commandeIdsKey
      ? commandeIdsKey.split(",").map((id) => Number(id))
      : [];
    // S'abonner a chaque canal de commande pour ecouter les mises a jour de statut
    ids.forEach((commandeId) => {
      const channel = echo.private(`commandes.${commandeId}`);
      // Ecoute de l'evenement de mise a jour du statut dans la commande pour rafraichir les donnees associees
      channel.listen(".status.updated", () => {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
      });
    });
    // Quitte les canaux de cette page
    return () => {
      ids.forEach((commandeId) => {
        echo.leave(`commandes.${commandeId}`);
      });
    };
  }, [commandeIdsKey, currentUserId, queryClient, realtimeActive]);
}

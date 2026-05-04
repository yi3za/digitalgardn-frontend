import { COMMANDE_STATUS } from "@/features/account/commandes/commandes.status";
import { useConversations } from "@/features/messages/messages.query";
import {
  incrementCommandes,
  resetCommandes,
  setConversationMessages,
} from "@/features/notifications/notificationsSlice";
import { getEcho, isRealtimeEnabled } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";

// Statuts de commande consideres comme clos : plus besoin d'ecouter les evenements
const STATUTS_CLOS = [COMMANDE_STATUS.TERMINEE, COMMANDE_STATUS.ANNULEE];

/**
 * useRealtimeSubscriptions :
 * hook de gestion des abonnements en temps reel
 */
export function useRealtimeSubscriptions(currentUserId) {
  // Client React Query pour invalider le cache
  const queryClient = useQueryClient();
  // Dispatcher Redux
  const dispatch = useDispatch();
  // Indique si le mode temps reel est actif
  const realtimeActive = isRealtimeEnabled();
  // Recuperation de la liste des conversations de l'utilisateur
  const conversationsQuery = useConversations(!realtimeActive, currentUserId);
  const conversations = conversationsQuery.data ?? [];
  // Initialisation des notifications de messages non lus par conversation a partir des conversations chargees
  useEffect(() => {
    if (!conversations.length) return;
    // Reset du compteur de commandes en attente avant de le recalculer
    dispatch(resetCommandes());
    // Initialise les messages non lus par conversation
    conversations.forEach((conversation) => {
      const count = conversation.unread_messages_count;
      dispatch(
        setConversationMessages({
          conversationId: conversation.id,
          count,
        }),
      );
      // Si la conversation est liee a une commande en attente, incrementer le compteur de commandes en attente
      if (
        !conversation.commande ||
        conversation.commande.service.user_id !== currentUserId
      )
        return;
      const statutCommande = conversation.commande?.statut;
      if (statutCommande === COMMANDE_STATUS.EN_ATTENTE)
        dispatch(incrementCommandes());
    });
  }, [conversations, dispatch]);
  // Liste stable des IDs de conversations actives (commande non close) pour eviter les abonnements inutiles
  const conversationIds = useMemo(
    () =>
      conversations
        .filter(
          (conversation) =>
            !conversation.commande ||
            !STATUTS_CLOS.includes(conversation.commande.statut),
        )
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
  // Liste stable des IDs de commandes liees aux conversations actives (statuts actifs uniquement)
  const commandeIds = useMemo(() => {
    const ids = conversations
      .filter(
        (conversation) =>
          conversation.commande &&
          !STATUTS_CLOS.includes(conversation.commande.statut),
      )
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
      channel.listen(".message.sent", async (payload) => {
        await queryClient.invalidateQueries({
          queryKey: ["messages", "conversation", payload?.conversation_id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
      });
    });
    // S'abonner a chaque canal de commande pour ecouter les mises a jour de statut
    commandeIds.forEach((commandeId) => {
      const channel = echo.private(`commandes.${commandeId}`);
      // Ecoute de l'evenement de mise a jour du statut dans la commande pour raf   raichir les donnees associees
      channel.listen(".commande.status.updated", () => {
        queryClient.invalidateQueries({
          queryKey: ["messages", "conversations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["portefeuille"],
        });
        queryClient.invalidateQueries({
          queryKey: ["commandes"],
        });
        // Mettre a jour le dashboard en temps reel lors d'un changement de statut
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });
      });
    });
    // Canal utilisateur pour les nouvelles conversations
    const userChannel = echo.private(`users.${currentUserId}`);
    // Ecoute la creation de conversation pour rafraichir la liste
    userChannel.listen(".conversation.created", (payload) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
      // Mettre a jour le dashboard et les commandes uniquement si la conversation est liee a une commande
      if (payload?.commande_id) {
        queryClient.invalidateQueries({
          queryKey: ["commandes"],
        });
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });
      }
    });
  }, [
    conversationIdsKey,
    commandeIdsKey,
    currentUserId,
    queryClient,
    realtimeActive,
  ]);
}

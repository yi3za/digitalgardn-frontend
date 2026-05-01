import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCommande,
  updateCommandeStatus,
  createAvis,
} from "./commandes.api";
import { COMMANDE_STATUS } from "./commandes.status";

// Hook pour creer une commande depuis un service
export const useCreateCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCommande(data),
    onSuccess: () => {
      // Met a jour les donnees de portefeuille apres un achat
      queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
      // Mettre a jour le dashboard (stats commandes + commandes recentes)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// Hook pour mettre a jour le statut d'une commande
export const useUpdateCommandeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commandeId, newStatus }) =>
      updateCommandeStatus(commandeId, newStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
      // Mettre a jour le dashboard (stats + commandes recentes + revenus si terminee)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      if (
        [COMMANDE_STATUS.TERMINEE, COMMANDE_STATUS.ANNULEE].includes(
          variables.newStatus,
        )
      ) {
        queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
      }
    },
  });
};

// Hook pour creer un avis sur une commande terminee
export const useCreateAvis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commandeId, data }) => createAvis(commandeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      // Mettre a jour les stats avis du dashboard
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

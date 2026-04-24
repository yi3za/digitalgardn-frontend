import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommande, updateCommandeStatus } from "./commandes.api";
import { COMMANDE_STATUS } from "./commandes.status";

// Hook pour creer une commande depuis un service
export const useCreateCommande = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCommande(data),
    onSuccess: () => {
      // Met a jour les donnees de portefeuille apres un achat
      queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
      queryClient.invalidateQueries({
        queryKey: ["portefeuille", "transactions"],
      });
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
      if (
        [COMMANDE_STATUS.TERMINEE, COMMANDE_STATUS.ANNULEE].includes(
          variables.newStatus,
        )
      ) {
        queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
        queryClient.invalidateQueries({
          queryKey: ["portefeuille", "transactions"],
        });
      }
    },
  });
};

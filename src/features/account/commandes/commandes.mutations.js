import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommande } from "./commandes.api";

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

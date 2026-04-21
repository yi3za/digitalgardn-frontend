import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechargerPortefeuille } from "./portefeuille.api";

// Hook pour recharger le portefeuille de l'utilisateur
export const useRechargerPortefeuille = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => rechargerPortefeuille(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
      queryClient.invalidateQueries({
        queryKey: ["portefeuille", "transactions"],
      });
    },
  });
};

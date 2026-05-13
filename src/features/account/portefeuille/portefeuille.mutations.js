import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechargerPortefeuille } from "./portefeuille.api";

// Hook pour recharger le portefeuille de l'utilisateur
export const useRechargerPortefeuille = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => rechargerPortefeuille(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portefeuille"] });
      // Mettre a jour les stats portefeuille et revenus du dashboard
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};

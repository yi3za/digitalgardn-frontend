import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyAvis } from "./avis.api";

// Mutation : supprimer un avis recu par le freelance connecte
export const useDeleteMyAvis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAvis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "avis"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

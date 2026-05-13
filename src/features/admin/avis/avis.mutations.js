import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminAvis } from "./avis.api";

// Mutation : supprimer un avis
export const useDeleteAdminAvis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminAvis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["service"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

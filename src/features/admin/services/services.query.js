import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminServices, updateAdminServiceStatus } from "./services.api";

// Liste des services
export const useAdminServices = () =>
  useQuery({
    queryKey: ["admin", "services"],
    queryFn: getAdminServices,
  });

// Mutation : modifier le statut d'un service
export const useUpdateAdminServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

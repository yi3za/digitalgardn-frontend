import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminService,
  getAdminServiceAvis,
  getAdminServices,
  updateAdminServiceStatus,
} from "./services.api";

// Liste des services
export const useAdminServices = () =>
  useQuery({
    queryKey: ["admin", "services"],
    queryFn: getAdminServices,
  });

// Detail d'un service (quel que soit son statut)
export const useAdminService = (slug) =>
  useQuery({
    queryKey: ["admin", "service", slug],
    queryFn: () => getAdminService(slug),
    enabled: !!slug,
  });

// Avis d'un service (quel que soit son statut)
export const useAdminServiceAvis = (slug) =>
  useQuery({
    queryKey: ["admin", "service", slug, "avis"],
    queryFn: () => getAdminServiceAvis(slug),
    enabled: !!slug,
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

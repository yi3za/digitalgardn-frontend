import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminService,
  getAdminServiceAvis,
  getAdminServices,
  updateAdminServiceStatus,
} from "./services.api";

// Liste des services
export const useAdminServices = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "services", filters],
    queryFn: () => getAdminServices(filters),
  });

// Detail d'un service (quel que soit son statut)
export const useAdminService = (slug) =>
  useQuery({
    queryKey: ["admin", "service", slug],
    queryFn: () => getAdminService(slug),
    enabled: !!slug,
  });

// Avis d'un service (quel que soit son statut)
export const useAdminServiceAvis = (slug, page = 1) =>
  useQuery({
    queryKey: ["admin", "service", slug, "avis", page],
    queryFn: () => getAdminServiceAvis(slug, page),
    enabled: !!slug,
  });

// Mutation : modifier le statut d'un service
export const useUpdateAdminServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminServiceStatus,
    onSuccess: (service) => {
      const slug = service?.slug;
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      if (slug) {
        queryClient.invalidateQueries({ queryKey: ["service", slug] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["categorie"] });
      queryClient.invalidateQueries({ queryKey: ["competence"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer"] });
      queryClient.invalidateQueries({ queryKey: ["top-freelancers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

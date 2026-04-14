import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyServices,
  getMyServiceBySlug,
  createService,
  updateService,
  deleteService,
  syncCategories,
  syncCompetences,
  syncFichiers,
} from "./services.api";

// Hook pour recuperer tous les services du freelance
export const useMyServices = () =>
  useQuery({
    queryKey: ["my-services"],
    queryFn: getMyServices,
  });

// Hook pour recuperer un service specifique par son slug
export const useMyService = (slug) =>
  useQuery({
    queryKey: ["my-service", slug],
    queryFn: () => getMyServiceBySlug(slug),
    enabled: !!slug,
  });

// Hook pour la creation d un service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
};

// Hook pour la mise a jour via slug
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => updateService(slug, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
    },
  });
};

// Hook pour la suppression via slug
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug) => deleteService(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
};

// Hook pour synchroniser les categories via slug
export const useSyncCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => syncCategories(slug, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
    },
  });
};

// Hook pour synchroniser les competences via slug
export const useSyncCompetences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => syncCompetences(slug, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
    },
  });
};

// Hook pour synchroniser les fichiers via slug
export const useSyncFichiers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => syncFichiers(slug, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
};

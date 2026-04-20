import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  updateService,
  updateServiceStatus,
  deleteService,
  syncCategories,
  syncCompetences,
  syncFichiers,
} from "./services.api";

// Hook pour la creation d un service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      // Invalider seulement le cache prive car la nouvelle service est toujours un brouillon
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
};

// Hook pour la mise a jour via slug
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => updateService(slug, data),
    onSuccess: (responseData, variables) => {
      // Extraire le service de la reponse API
      const service = responseData?.details?.service;
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      // Invalider le cache public seulement si la service est publiee
      if (service?.statut === "publie") {
        queryClient.invalidateQueries({
          queryKey: ["service", variables.slug],
        });
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
  });
};

// Hook pour la mise a jour du statut d'un service via endpoint dedie
export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => updateServiceStatus(slug, data),
    onSuccess: (responseData, variables) => {
      const service = responseData?.details?.service;
      const previousStatut = variables?.currentStatut;
      const nextStatut = service?.statut;
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      // Si le service etait public ou le devient, on invalide le cache public.
      if (previousStatut === "publie" || nextStatut === "publie") {
        queryClient.invalidateQueries({
          queryKey: ["service", variables.slug],
        });
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
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
      // Invalider le cache public pour enlever la service supprimee
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

// Hook pour synchroniser les categories via slug
export const useSyncCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => syncCategories(slug, data),
    onSuccess: (responseData, variables) => {
      // Extraire le statut de la reponse API
      const statut = responseData?.details?.serviceStatut;
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      // Invalider le cache public seulement si la service est publiee
      if (statut === "publie") {
        queryClient.invalidateQueries({
          queryKey: ["service", variables.slug],
        });
      }
    },
  });
};

// Hook pour synchroniser les competences via slug
export const useSyncCompetences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => syncCompetences(slug, data),
    onSuccess: (responseData, variables) => {
      // Extraire le statut de la reponse API
      const statut = responseData?.details?.serviceStatut;
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      // Invalider le cache public seulement si la service est publiee
      if (statut === "publie") {
        queryClient.invalidateQueries({
          queryKey: ["service", variables.slug],
        });
      }
    },
  });
};

// Hook pour synchroniser les fichiers via slug
export const useSyncFichiers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, files }) => syncFichiers(slug, files),
    onSuccess: (responseData, variables) => {
      // Extraire le statut de la reponse API
      const statut = responseData?.details?.serviceStatut;
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      // Invalider le cache public seulement si la service est publiee
      if (statut === "publie") {
        queryClient.invalidateQueries({
          queryKey: ["service", variables.slug],
        });
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
  });
};

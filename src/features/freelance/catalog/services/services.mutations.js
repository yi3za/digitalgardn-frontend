import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVICE_STATUS } from "./services.status";
import {
  createService,
  updateService,
  updateServiceStatus,
  deleteService,
  syncCategories,
  syncCompetences,
  syncFichiers,
} from "./services.api";

function invalidateServiceCatalog(queryClient, slug = null) {
  queryClient.invalidateQueries({ queryKey: ["services"] });
  queryClient.invalidateQueries({ queryKey: ["categorie"] });
  queryClient.invalidateQueries({ queryKey: ["competence"] });
  queryClient.invalidateQueries({ queryKey: ["freelancer"] });
  queryClient.invalidateQueries({ queryKey: ["top-freelancers"] });
  if (slug) {
    queryClient.invalidateQueries({ queryKey: ["service", slug] });
  }
  queryClient.invalidateQueries({ queryKey: ["admin"] });
}

// Hook pour la creation d un service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      // Invalider seulement le cache prive car la nouvelle service est toujours un brouillon
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      // Mettre a jour le compteur services du dashboard
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
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
      const slug = service?.slug ?? variables.slug;
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      if (slug !== variables.slug) {
        queryClient.invalidateQueries({ queryKey: ["my-service", slug] });
      }
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      // Invalider le cache public seulement si la service est publiee
      if (service?.statut === SERVICE_STATUS.PUBLIE) {
        invalidateServiceCatalog(queryClient, slug);
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
      const slug = service?.slug ?? variables.slug;
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({
        queryKey: ["my-service", variables.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      // Si le service etait public ou le devient, on invalide le cache public.
      if (
        previousStatut === SERVICE_STATUS.PUBLIE ||
        nextStatut === SERVICE_STATUS.PUBLIE
      ) {
        invalidateServiceCatalog(queryClient, slug);
      }
      // Mettre a jour le compteur services du dashboard
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

// Hook pour la suppression via slug
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug) => deleteService(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      queryClient.invalidateQueries({ queryKey: ["my-service", slug] });
      // Invalider le cache public pour enlever la service supprimee
      invalidateServiceCatalog(queryClient, slug);
      // Mettre a jour le compteur services du dashboard
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
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
      if (statut === SERVICE_STATUS.PUBLIE) {
        invalidateServiceCatalog(queryClient, variables.slug);
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
      if (statut === SERVICE_STATUS.PUBLIE) {
        invalidateServiceCatalog(queryClient, variables.slug);
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
      if (statut === SERVICE_STATUS.PUBLIE) {
        invalidateServiceCatalog(queryClient, variables.slug);
      }
    },
  });
};

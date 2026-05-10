import { useQuery } from "@tanstack/react-query";
import { getServiceBySlug, getServices, getServiceAvis } from "./services.api";

// Hook pour toutes les services
export const useServices = (filters = {}) =>
  useQuery({
    queryKey: ["services", filters],
    queryFn: () => getServices(filters),
  });

// Hook pour un service par slug
export const useService = (slug) =>
  useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });

// Hook pour les avis d'un service
export const useServiceAvis = (slug, page = 1) =>
  useQuery({
    queryKey: ["service", slug, "avis", page],
    queryFn: () => getServiceAvis(slug, page),
    enabled: !!slug,
  });

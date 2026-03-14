import { useQuery } from "@tanstack/react-query";
import { getServiceBySlug, getServices } from "./services.api";

// Hook pour toutes les services
export const useServices = () =>
  useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

// Hook pour un service par slug
export const useService = (slug) =>
  useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: !!slug,
  });

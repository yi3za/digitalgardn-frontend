import { useQuery } from "@tanstack/react-query";
import { getMyServices, getMyServiceBySlug } from "./services.api";

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

import { useQuery } from "@tanstack/react-query";
import { getCategories, getServicesByCategorie } from "./categories.api";

// Hook pour toutes les categories
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

// Hook pour services d'une categorie
export const useServicesByCategorie = (slug) =>
  useQuery({
    queryKey: ["categorie", slug, "services"],
    queryFn: () => getServicesByCategorie(slug),
    enabled: !!slug,
  });

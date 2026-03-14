import { useQuery } from "@tanstack/react-query";
import {
  getCategorieBySlug,
  getCategories,
  getServicesByCategorie,
} from "./categories.api";

// Hook pour toutes les categories
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

// Hook pour une categorie par slug
export const useCategorie = (slug) =>
  useQuery({
    queryKey: ["categorie", slug],
    queryFn: () => getCategorieBySlug(slug),
    enabled: !!slug,
  });

// Hook pour services d'une categorie
export const useServicesByCategorie = (slug) =>
  useQuery({
    queryKey: ["categorie", slug, "services"],
    queryFn: () => getServicesByCategorie(slug),
    enabled: !!slug,
  });

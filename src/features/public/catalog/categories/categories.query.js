import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategorieBySlug,
  getServicesByCategorie,
} from "./categories.api";

// Hook pour toutes les categories
export const useCategories = (filters = {}) =>
  useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
  });

// Hook pour une categorie par slug
export const useCategorieBySlug = (slug) =>
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

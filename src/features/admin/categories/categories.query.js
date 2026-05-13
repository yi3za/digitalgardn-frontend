import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCategories,
  getAdminCategorieBySlug,
  getAdminServicesByCategorie,
  createAdminCategorie,
  updateAdminCategorie,
  deleteAdminCategorie,
} from "./categories.api";

// Liste des categories
export const useAdminCategories = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "categories", filters],
    queryFn: () => getAdminCategories(filters),
  });

// Detail d'une categorie par slug (quel que soit son statut)
export const useAdminCategorieBySlug = (slug) =>
  useQuery({
    queryKey: ["admin", "categorie", slug],
    queryFn: () => getAdminCategorieBySlug(slug),
    enabled: !!slug,
  });

// Services d'une categorie (quel que soit leur statut)
export const useAdminServicesByCategorie = (slug, params = {}) =>
  useQuery({
    queryKey: ["admin", "categorie", slug, "services", params],
    queryFn: () => getAdminServicesByCategorie(slug, params),
    enabled: !!slug,
  });

// Mutation : creer une categorie
export const useCreateAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Mutation : modifier une categorie
export const useUpdateAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCategorie,
    onSuccess: (categorie) => {
      const slug = categorie?.slug;
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (slug) {
        queryClient.invalidateQueries({ queryKey: ["categorie", slug] });
      }
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

// Mutation : supprimer une categorie
export const useDeleteAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categorie"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

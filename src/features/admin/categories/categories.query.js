import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCategories,
  createAdminCategorie,
  updateAdminCategorie,
  deleteAdminCategorie,
} from "./categories.api";

// Liste des categories
export const useAdminCategories = () =>
  useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAdminCategories,
  });

// Mutation : creer une categorie
export const useCreateAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Mutation : modifier une categorie
export const useUpdateAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Mutation : supprimer une categorie
export const useDeleteAdminCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

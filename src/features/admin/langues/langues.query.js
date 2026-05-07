import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminLangues,
  getAdminLangueById,
  createAdminLangue,
  updateAdminLangue,
  deleteAdminLangue,
} from "./langues.api";

// Liste des langues
export const useAdminLangues = () =>
  useQuery({
    queryKey: ["admin", "langues"],
    queryFn: getAdminLangues,
  });

// Detail d'une langue par id
export const useAdminLangueById = (id) =>
  useQuery({
    queryKey: ["admin", "langue", id],
    queryFn: () => getAdminLangueById(id),
    enabled: !!id,
  });

// Mutation : creer une langue
export const useCreateAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "langues"] });
    },
  });
};

// Mutation : modifier une langue
export const useUpdateAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "langues"] });
    },
  });
};

// Mutation : supprimer une langue
export const useDeleteAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "langues"] });
    },
  });
};

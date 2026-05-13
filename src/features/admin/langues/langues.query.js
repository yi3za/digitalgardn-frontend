import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminLangues,
  createAdminLangue,
  updateAdminLangue,
  deleteAdminLangue,
} from "./langues.api";

// Liste des langues
export const useAdminLangues = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "langues", filters],
    queryFn: () => getAdminLangues(filters),
  });

// Mutation : creer une langue
export const useCreateAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["langues"] });
    },
  });
};

// Mutation : modifier une langue
export const useUpdateAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["langues"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer"] });
    },
  });
};

// Mutation : supprimer une langue
export const useDeleteAdminLangue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminLangue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["langues"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer"] });
    },
  });
};

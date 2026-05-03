import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCompetences,
  createAdminCompetence,
  updateAdminCompetence,
  deleteAdminCompetence,
} from "./competences.api";

// Liste des competences
export const useAdminCompetences = () =>
  useQuery({
    queryKey: ["admin", "competences"],
    queryFn: getAdminCompetences,
  });

// Mutation : creer une competence
export const useCreateAdminCompetence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCompetence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competences"] });
    },
  });
};

// Mutation : modifier une competence
export const useUpdateAdminCompetence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminCompetence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competences"] });
    },
  });
};

// Mutation : supprimer une competence
export const useDeleteAdminCompetence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCompetence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "competences"] });
    },
  });
};

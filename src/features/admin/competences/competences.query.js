import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCompetences,
  getAdminCompetenceBySlug,
  getAdminServicesByCompetence,
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

// Detail d'une competence par slug (quel que soit son statut)
export const useAdminCompetenceBySlug = (slug) =>
  useQuery({
    queryKey: ["admin", "competence", slug],
    queryFn: () => getAdminCompetenceBySlug(slug),
    enabled: !!slug,
  });

// Services d'une competence (quel que soit leur statut)
export const useAdminServicesByCompetence = (slug, params = {}) =>
  useQuery({
    queryKey: ["admin", "competence", slug, "services", params],
    queryFn: () => getAdminServicesByCompetence(slug, params),
    enabled: !!slug,
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

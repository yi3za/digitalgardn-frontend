import { useQuery } from "@tanstack/react-query";
import {
  getCompetences,
  getCompetenceBySlug,
  getServicesByCompetence,
} from "./competences.api";

// Hook pour toutes les competences
export const useCompetences = (filters = {}) =>
  useQuery({
    queryKey: ["competences", filters],
    queryFn: () => getCompetences(filters),
  });

// Hook pour une competence par slug
export const useCompetenceBySlug = (slug) =>
  useQuery({
    queryKey: ["competence", slug],
    queryFn: () => getCompetenceBySlug(slug),
    enabled: !!slug,
  });

// Hook pour services d'une competence
export const useServicesByCompetence = (slug, params = {}) =>
  useQuery({
    queryKey: ["competence", slug, "services", params],
    queryFn: () => getServicesByCompetence(slug, params),
    enabled: !!slug,
  });

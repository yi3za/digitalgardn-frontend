import { useQuery } from "@tanstack/react-query";
import {
  getCompetenceBySlug,
  getCompetences,
  getServicesByCompetence,
} from "./competences.api";

// Hook pour toutes les competences
export const useCompetences = () =>
  useQuery({
    queryKey: ["competences"],
    queryFn: getCompetences,
  });

// Hook pour une competence par slug
export const useCompetence = (slug) =>
  useQuery({
    queryKey: ["competence", slug],
    queryFn: () => getCompetenceBySlug(slug),
    enabled: !!slug,
  });

// Hook pour services d'une competence
export const useServicesByCompetence = (slug) =>
  useQuery({
    queryKey: ["competences", slug, "services"],
    queryFn: () => getServicesByCompetence(slug),
    enabled: !!slug,
  });

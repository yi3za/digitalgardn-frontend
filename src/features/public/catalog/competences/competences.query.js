import { useQuery } from "@tanstack/react-query";
import { getCompetences, getServicesByCompetence } from "./competences.api";

// Hook pour toutes les competences
export const useCompetences = () =>
  useQuery({
    queryKey: ["competences"],
    queryFn: getCompetences,
  });

// Hook pour services d'une competence
export const useServicesByCompetence = (slug) =>
  useQuery({
    queryKey: ["competence", slug, "services"],
    queryFn: () => getServicesByCompetence(slug),
    enabled: !!slug,
  });

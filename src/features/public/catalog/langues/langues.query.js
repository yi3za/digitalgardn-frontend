import { useQuery } from "@tanstack/react-query";
import { getLangues, getLangueById } from "./langues.api";

// Hook pour toutes les langues
export const useLangues = (filters = {}) =>
  useQuery({
    queryKey: ["langues", filters],
    queryFn: () => getLangues(filters),
  });

// Hook pour une langue par id
export const useLangueById = (id) =>
  useQuery({
    queryKey: ["langue", id],
    queryFn: () => getLangueById(id),
    enabled: !!id,
  });

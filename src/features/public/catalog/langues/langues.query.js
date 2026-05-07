import { useQuery } from "@tanstack/react-query";
import { getLangues } from "./langues.api";

// Hook pour toutes les langues
export const useLangues = (filters = {}) =>
  useQuery({
    queryKey: ["langues", filters],
    queryFn: () => getLangues(filters),
  });

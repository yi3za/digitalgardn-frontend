import { useQuery } from "@tanstack/react-query";
import { getMyAvis } from "./avis.api";

// Hook pour recuperer les avis recus par le freelance connecte
export const useMyAvis = (filters = {}) =>
  useQuery({
    queryKey: ["me", "avis", filters],
    queryFn: () => getMyAvis(filters),
  });

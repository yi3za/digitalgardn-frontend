import { useQuery } from "@tanstack/react-query";
import { getAdminPortefeuilles } from "./portefeuilles.api";

// Liste de tous les portefeuilles
export const useAdminPortefeuilles = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "portefeuilles", filters],
    queryFn: () => getAdminPortefeuilles(filters),
  });

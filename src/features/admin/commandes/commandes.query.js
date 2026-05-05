import { useQuery } from "@tanstack/react-query";
import { getAdminCommandes } from "./commandes.api";

// Liste des commandes
export const useAdminCommandes = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "commandes", filters],
    queryFn: () => getAdminCommandes(filters),
  });

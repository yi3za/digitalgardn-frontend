import { useQuery } from "@tanstack/react-query";
import { getAdminCommandes } from "./commandes.api";

// Liste des commandes
export const useAdminCommandes = () =>
  useQuery({
    queryKey: ["admin", "commandes"],
    queryFn: getAdminCommandes,
  });

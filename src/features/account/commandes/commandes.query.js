import { useQuery } from "@tanstack/react-query";
import { getCommandes } from "./commandes.api";

//  Recupere la liste des commandes de l'utilisateur courant
export const useCommandes = (filters = {}) => {
  return useQuery({
    queryKey: ["commandes", filters],
    queryFn: () => getCommandes(filters),
  });
};

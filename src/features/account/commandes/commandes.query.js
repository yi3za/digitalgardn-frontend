import { useQuery } from "@tanstack/react-query";
import { getCommandes } from "./commandes.api";

//  Recupere la liste des commandes de l'utilisateur courant
export const useCommandes = () => {
  return useQuery({
    queryKey: ["commandes"],
    queryFn: getCommandes,
  });
};

import { useQuery } from "@tanstack/react-query";
import { getCommande, getCommandes } from "./commandes.api";

//  Recupere la liste des commandes de l'utilisateur courant
export const useCommandes = () => {
  return useQuery({
    queryKey: ["commandes"],
    queryFn: getCommandes,
  });
};

// Recupere les details d'une commande specifique par son ID
export const useCommande = (commandeId) => {
  return useQuery({
    queryKey: ["commande", commandeId],
    queryFn: () => getCommande(commandeId),
    enabled: !!commandeId,
  });
};

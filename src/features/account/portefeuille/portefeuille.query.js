import { useQuery } from "@tanstack/react-query";
import {
  getPortefeuille,
  getPortefeuilleTransactions,
} from "./portefeuille.api";

// Hook pour recuperer le portefeuille de l'utilisateur avec son historique de transactions
export const usePortefeuille = () =>
  useQuery({
    queryKey: ["portefeuille"],
    queryFn: getPortefeuille,
  });

// Hook pour recuperer l'historique des transactions du portefeuille
export const usePortefeuilleTransactions = (filters = {}) =>
  useQuery({
    queryKey: ["portefeuille", "transactions", filters],
    queryFn: () => getPortefeuilleTransactions(filters),
  });

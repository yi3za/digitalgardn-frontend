import { client, contentTypeJson } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere le portefeuille de l'utilisateur connecte avec son historique de transactions
export const getPortefeuille = async () => {
  const { data } = await client.get("/api/me/portefeuille");
  const portefeuille = data?.details?.portefeuille;
  if (!portefeuille) return null;
  return portefeuille ?? {};
};

// Recupere l'historique des transactions du portefeuille
export const getPortefeuilleTransactions = async (filters = {}) => {
  const { data } = await client.get("/api/me/portefeuille/transactions", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.transactions ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Recharge le portefeuille d'un montant donne (simulation)
export const rechargerPortefeuille = async (payload) => {
  const { data } = await client.post(
    "/api/me/portefeuille/recharge",
    payload,
    contentTypeJson,
  );
  const portefeuille = data?.details?.portefeuille;
  if (!portefeuille) return null;
  return portefeuille ?? {};
};

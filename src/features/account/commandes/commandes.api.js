import { client } from "@/api/client";

// Cree une nouvelle commande pour le service cible
export const createCommande = async (payload) => {
  const { data } = await client.post("/api/me/commandes", payload);
  return data?.details?.commande ?? null;
};

import { client } from "@/api/client";

//  Recupere la liste des commandes de l'utilisateur courant
export const getCommandes = async () => {
  const { data } = await client.get("/api/me/commandes");
  return data?.details?.commandes ?? [];
};

// Recupere les details d'une commande specifique par son ID
export const getCommande = async (commandeId) => {
  const { data } = await client.get(`/api/me/commandes/${commandeId}`);
  return data?.details?.commande ?? null;
};

// Cree une nouvelle commande pour le service cible
export const createCommande = async (payload) => {
  const { data } = await client.post("/api/me/commandes", payload);
  return data?.details?.commande ?? null;
};

import { client, contentTypeJson } from "@/api/client";

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
  const { data } = await client.post(
    "/api/me/commandes",
    payload,
    contentTypeJson,
  );
  return data?.details?.commande ?? null;
};

// Met a jour le statut d'une commande specifique
export const updateCommandeStatus = async (commandeId, newStatus) => {
  const { data } = await client.patch(
    `/api/me/commandes/${commandeId}/status`,
    { statut: newStatus },
    contentTypeJson,
  );
  return data?.details?.commande ?? null;
};

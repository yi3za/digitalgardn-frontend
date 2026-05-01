import { client, contentTypeJson } from "@/api/client";

//  Recupere la liste des commandes de l'utilisateur courant
export const getCommandes = async () => {
  const { data } = await client.get("/api/me/commandes");
  return data?.details?.commandes ?? [];
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

// Cree un avis pour une commande terminee
export const createAvis = async (commandeId, payload) => {
  const { data } = await client.post(
    `/api/me/commandes/${commandeId}/avis`,
    payload,
    contentTypeJson,
  );
  return data?.details?.avis ?? null;
};

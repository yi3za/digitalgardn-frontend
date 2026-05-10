import { client } from "@/api/client";

// Statistiques globales de la plateforme
export const getAdminStats = async () => {
  const { data } = await client.get("/api/admin/stats");
  return data?.details?.stats ?? null;
};

// Activite recente : services en attente + derniers inscrits + dernieres commandes + derniers avis
export const getAdminActivite = async () => {
  const { data } = await client.get("/api/admin/stats/activite");
  return data?.details ?? null;
};

// Tendances mensuelles : inscriptions et commandes
export const getAdminTendances = async () => {
  const { data } = await client.get("/api/admin/stats/tendances");
  return data?.details ?? null;
};

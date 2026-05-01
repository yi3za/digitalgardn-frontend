import { client } from "@/api/client";

// Recupere les statistiques globales du dashboard
export const getDashboardStats = async () => {
  const { data } = await client.get("/api/me/dashboard/stats");
  return data?.details?.stats ?? null;
};

// Recupere les commandes recentes du freelance
export const getDashboardCommandesRecentes = async () => {
  const { data } = await client.get("/api/me/dashboard/commandes-recentes");
  return data?.details?.commandes ?? [];
};

// Recupere les revenus mensuels sur les 6 derniers mois
export const getDashboardRevenuesMensuels = async () => {
  const { data } = await client.get("/api/me/dashboard/revenus-mensuels");
  return data?.details?.revenus ?? [];
};

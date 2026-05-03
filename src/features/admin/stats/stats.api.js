import { client } from "@/api/client";

// Statistiques globales de la plateforme
export const getAdminStats = async () => {
  const { data } = await client.get("/api/admin/stats");
  return data?.details?.stats ?? null;
};

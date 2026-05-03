import { client } from "@/api/client";

// Liste des commandes
export const getAdminCommandes = async () => {
  const { data } = await client.get("/api/admin/commandes");
  return data?.details.commandes ?? [];
};

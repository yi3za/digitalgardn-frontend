import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste des commandes
export const getAdminCommandes = async (filters = {}) => {
  const { data } = await client.get("/api/admin/commandes", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details.commandes ?? [],
    meta: data?.details?.meta ?? {},
  };
};

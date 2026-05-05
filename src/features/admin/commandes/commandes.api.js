import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste des commandes
export const getAdminCommandes = async (filters = {}) => {
  const { data } = await client.get("/api/admin/commandes", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details.commandes ?? [],
    meta: data?.details.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

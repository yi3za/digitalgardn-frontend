import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste de tous les portefeuilles
export const getAdminPortefeuilles = async (filters = {}) => {
  const { data } = await client.get("/api/admin/portefeuilles", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.portefeuilles ?? [],
    meta: data?.details?.meta ?? {},
  };
};

import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Liste de tous les portefeuilles
export const getAdminPortefeuilles = async (filters = {}) => {
  const { data } = await client.get("/api/admin/portefeuilles", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.portefeuilles ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

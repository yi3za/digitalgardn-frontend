import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les langues
export const getLangues = async (filters = {}) => {
  const { data } = await client.get("/api/langues", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.langues ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};


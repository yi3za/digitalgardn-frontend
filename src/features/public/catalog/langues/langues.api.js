import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les langues
export const getLangues = async (filters = {}) => {
  const { data } = await client.get("/api/langues", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.langues ?? [],
    meta: data?.details?.meta ?? {},
  };
};


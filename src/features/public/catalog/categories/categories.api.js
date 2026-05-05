import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les categories
export const getCategories = async (filters = {}) => {
  const { data } = await client.get("/api/categories", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.categories ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

// Recupere une categorie par slug avec ses enfants
export const getCategorieBySlug = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}`);
  return data?.details?.categorie;
};

// Recupere tous les services d'une categorie
export const getServicesByCategorie = async (slug, params = {}) => {
  const { data } = await client.get(`/api/categories/${slug}/services`, {
    params: cleanFilters(params),
  });
  return {
    items: data?.details?.services ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

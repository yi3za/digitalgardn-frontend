import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les competences
export const getCompetences = async (filters = {}) => {
  const { data } = await client.get("/api/competences", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.competences ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

// Recupere une competence par slug avec ses enfants
export const getCompetenceBySlug = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}`);
  return data?.details?.competence;
};

// Recupere tous les services d'une competence
export const getServicesByCompetence = async (slug, params = {}) => {
  const { data } = await client.get(`/api/competences/${slug}/services`, {
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

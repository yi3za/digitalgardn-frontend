import { client, contentTypeMultipart } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les comptences
export const getAdminCompetences = async (filters = {}) => {
  const { data } = await client.get("/api/admin/competences", {
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

// Detail d'une competence par slug (quel que soit son statut)
export const getAdminCompetenceBySlug = async (slug) => {
  const { data } = await client.get(`/api/admin/competences/${slug}`);
  return data?.details?.competence ?? null;
};

// Services d'une competence (quel que soit leur statut)
export const getAdminServicesByCompetence = async (slug, params = {}) => {
  const { data } = await client.get(`/api/admin/competences/${slug}/services`, {
    params,
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

// Creer une competence
export const createAdminCompetence = async (payload) => {
  const { data } = await client.post(
    "/api/admin/competences",
    payload,
    contentTypeMultipart,
  );
  return data?.details?.competence ?? null;
};

// Modifier une competence
export const updateAdminCompetence = async ({ id, ...payload }) => {
  const { data } = await client.post(
    `/api/admin/competences/${id}`,
    payload,
    contentTypeMultipart,
  );
  return data?.details?.competence ?? null;
};

// Supprimer une competence
export const deleteAdminCompetence = async (id) => {
  await client.delete(`/api/admin/competences/${id}`);
};

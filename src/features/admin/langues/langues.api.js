import { client, contentTypeJson } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste toutes les langues
export const getAdminLangues = async (filters = {}) => {
  const { data } = await client.get("/api/admin/langues", {
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

// Creer une langue
export const createAdminLangue = async (payload) => {
  const { data } = await client.post(
    "/api/admin/langues",
    payload,
    contentTypeJson,
  );
  return data?.details?.langue ?? null;
};

// Modifier une langue
export const updateAdminLangue = async ({ id, ...payload }) => {
  const { data } = await client.post(
    `/api/admin/langues/${id}`,
    payload,
    contentTypeJson,
  );
  return data?.details?.langue ?? null;
};

// Supprimer une langue
export const deleteAdminLangue = async (id) => {
  await client.delete(`/api/admin/langues/${id}`);
};

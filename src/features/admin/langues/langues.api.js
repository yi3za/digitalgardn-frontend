import { client, contentTypeJson } from "@/api/client";

// Liste toutes les langues
export const getAdminLangues = async () => {
  const { data } = await client.get("/api/admin/langues");
  return data?.details?.langues ?? [];
};

// Detail d'une langue par id
export const getAdminLangueById = async (id) => {
  const { data } = await client.get(`/api/admin/langues/${id}`);
  return data?.details?.langue ?? null;
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

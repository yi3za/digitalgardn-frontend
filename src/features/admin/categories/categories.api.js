import { client, contentTypeMultipart } from "@/api/client";

// Liste toutes les categories
export const getAdminCategories = async () => {
  const { data } = await client.get("/api/admin/categories");
  return data?.details?.categories ?? [];
};

// Creer une categorie
export const createAdminCategorie = async (payload) => {
  const { data } = await client.post(
    "/api/admin/categories",
    payload,
    contentTypeMultipart,
  );
  return data?.details?.categorie ?? null;
};

// Modifier une categorie
export const updateAdminCategorie = async ({ id, ...payload }) => {
  const { data } = await client.post(
    `/api/admin/categories/${id}`,
    payload,
    contentTypeMultipart,
  );
  return data?.details?.categorie ?? null;
};

// Supprimer une categorie
export const deleteAdminCategorie = async (id) => {
  await client.delete(`/api/admin/categories/${id}`);
};

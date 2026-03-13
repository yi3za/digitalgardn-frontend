import { client } from "@/api/client";

// Recupere toutes les categories
export const getCategories = async () => {
  const { data } = await client.get("/api/categories");
  return data;
};

// Recupere une categorie specifique
export const getCategorieBySlug = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}`);
  return data;
};

// Recupere tous les services d'une categorie
export const getServicesByCategorie = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}/services`);
  return data;
};

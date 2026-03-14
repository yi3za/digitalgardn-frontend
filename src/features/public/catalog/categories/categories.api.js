import { client } from "@/api/client";

// Recupere toutes les categories
export const getCategories = async () => {
  const { data } = await client.get("/api/categories");
  return data?.details?.categories;
};

// Recupere une categorie specifique
export const getCategorieBySlug = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}`);
  return data?.details?.categorie;
};

// Recupere tous les services d'une categorie
export const getServicesByCategorie = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}/services`);
  return data?.details?.services;
};

import { client } from "@/api/client";

// Recupere toutes les categories
export const getCategories = async () => {
  const { data } = await client.get("/api/categories");
  return data?.details?.categories;
};

// Recupere tous les services d'une categorie
export const getServicesByCategorie = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}/services`);
  return data?.details?.services;
};

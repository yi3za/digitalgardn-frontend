import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Recupere toutes les categories
export const getCategories = async (filters = {}) => {
  const { data } = await client.get("/api/categories", {
    params: cleanFilters(filters),
  });
  return data?.details?.categories;
};

// Recupere une categorie par slug avec ses enfants
export const getCategorieBySlug = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}`);
  return data?.details?.categorie;
};

// Recupere tous les services d'une categorie
export const getServicesByCategorie = async (slug) => {
  const { data } = await client.get(`/api/categories/${slug}/services`);
  return data?.details?.services;
};

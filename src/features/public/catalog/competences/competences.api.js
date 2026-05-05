import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Recupere toutes les competences
export const getCompetences = async (filters = {}) => {
  const { data } = await client.get("/api/competences", {
    params: cleanFilters(filters),
  });
  return data?.details?.competences;
};

// Recupere une competence par slug avec ses enfants
export const getCompetenceBySlug = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}`);
  return data?.details?.competence;
};

// Recupere tous les services d'une competence
export const getServicesByCompetence = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}/services`);
  return data?.details?.services;
};

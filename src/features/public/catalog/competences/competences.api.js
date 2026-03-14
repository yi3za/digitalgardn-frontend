import { client } from "@/api/client";

// Recupere toutes les competences
export const getCompetences = async () => {
  const { data } = await client.get("/api/competences");
  return data?.details?.competences;
};

// Recupere une competence specifique
export const getCompetenceBySlug = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}`);
  return data?.details?.competence;
};

// Recupere tous les services d'une competence
export const getServicesByCompetence = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}/services`);
  return data?.details?.services;
};

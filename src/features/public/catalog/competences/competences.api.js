import { client } from "@/api/client";

// Recupere toutes les competences
export const getCompetences = async () => {
  const { data } = await client.get("/api/competences");
  return data?.details?.competences;
};

// Recupere tous les services d'une competence
export const getServicesByCompetence = async (slug) => {
  const { data } = await client.get(`/api/competences/${slug}/services`);
  return data?.details?.services;
};

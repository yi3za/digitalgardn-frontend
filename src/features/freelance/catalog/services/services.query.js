import { client } from "@/api/client";

// Recupere tous les services du freelance connecte
export const getMyServices = async () => {
  const { data } = await client.get("/api/me/services");
  return data?.details?.services;
};

// Recupere un service specifique par son slug
export const getMyServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/me/services/${slug}`);
  return data?.details?.service;
};

// Cree un nouveau service
export const createService = async (payload) => {
  const { data } = await client.post("/api/me/services", payload);
  return data;
};

// Met a jour un service existant
export const updateService = async (slug, payload) => {
  const { data } = await client.patch(`/api/me/services/${slug}`, payload);
  return data;
};

// Supprime un service
export const deleteService = async (slug) => {
  const { data } = await client.delete(`/api/me/services/${slug}`);
  return data;
};

// Synchronise les categories d’un service
export const syncCategories = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/categories`,
    payload,
  );
  return data;
};

// Synchronise les competences d’un service
export const syncCompetences = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/competences`,
    payload,
  );
  return data;
};

// Synchronise les fichiers d’un service
export const syncFichiers = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/fichiers`,
    payload,
  );
  return data;
};

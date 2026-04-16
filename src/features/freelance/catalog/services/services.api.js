import { client } from "@/api/client";

// Recupere tous les services du freelance connecte
export const getMyServices = async () => {
  const { data } = await client.get("/api/me/services");
  return data?.details?.services;
};

// Recupere un service specifique par slug
export const getMyServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/me/services/${slug}`);
  return data?.details?.service;
};

// Creation d'un service
export const createService = async (payload) => {
  const { data } = await client.post("/api/me/services", payload);
  return data;
};

// Mise a jour d'un service (par slug)
export const updateService = async (slug, payload) => {
  const { data } = await client.patch(`/api/me/services/${slug}`, payload);
  return data;
};

// Supprimer un service (par slug)
export const deleteService = async (slug) => {
  const { data } = await client.delete(`/api/me/services/${slug}`);
  return data;
};

// Synchroniser les categories d'un service
export const syncCategories = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/categories`,
    payload,
  );
  return data;
};

// Synchroniser les competences d'un service
export const syncCompetences = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/competences`,
    payload,
  );
  return data;
};

// Synchroniser les fichiers d'un service (multipart/form-data)
export const syncFichiers = async (slug, files) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  files.forEach((file) => formData.append("fichiers[]", file));
  const { data } = await client.post(
    `/api/me/services/${slug}/fichiers`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

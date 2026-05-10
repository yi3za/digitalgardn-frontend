import { client, contentTypeJson, contentTypeMultipart } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere tous les services du freelance connecte
export const getMyServices = async (filters = {}) => {
  const { data } = await client.get("/api/me/services", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.services ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Recupere un service specifique par slug
export const getMyServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/me/services/${slug}`);
  return data?.details?.service;
};

// Creation d'un service
export const createService = async (payload) => {
  const { data } = await client.post(
    "/api/me/services",
    payload,
    contentTypeJson,
  );
  return data;
};

// Mise a jour d'un service (par slug)
export const updateService = async (slug, payload) => {
  const { data } = await client.patch(
    `/api/me/services/${slug}`,
    payload,
    contentTypeJson,
  );
  return data;
};

// Mise a jour du statut d'un service (par slug)
export const updateServiceStatus = async (slug, payload) => {
  const { data } = await client.patch(
    `/api/me/services/${slug}/status`,
    payload,
    contentTypeJson,
  );
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
    contentTypeJson,
  );
  return data;
};

// Synchroniser les competences d'un service
export const syncCompetences = async (slug, payload) => {
  const { data } = await client.put(
    `/api/me/services/${slug}/competences`,
    payload,
    contentTypeJson,
  );
  return data;
};

// Synchroniser les fichiers d'un service (multipart/form-data)
export const syncFichiers = async (slug, fichiers) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  // Parcours de la liste des fichiers pour les ajouter au FormData
  fichiers.forEach((item, index) => {
    // Si l'item est de type "existing", on ajoute son ID et son ordre dans le FormData, sinon on ajoute le fichier lui-meme
    if (item.type === "existing") {
      formData.append("existing_fichiers[]", item.id);
      formData.append(`existing_fichiers_order[${item.id}]`, index);
      return;
    }
    formData.append("fichiers[]", item.file);
    formData.append("fichiers_order[]", index);
  });
  // Envoi de la requete POST avec le FormData et le content type multipart/form-data
  const { data } = await client.post(
    `/api/me/services/${slug}/fichiers`,
    formData,
    contentTypeMultipart,
  );
  return data;
};

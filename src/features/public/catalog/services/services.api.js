import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Recupere toutes les services
export const getServices = async (filters = {}) => {
  const { data } = await client.get("/api/services", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.services ?? [],
    meta: data?.details?.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

// Recupere un service specifique
export const getServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/services/${slug}`);
  return data?.details?.service;
};

// Recupere les avis d'un service specifique
export const getServiceAvis = async (slug) => {
  const { data } = await client.get(`/api/services/${slug}/avis`);
  return data?.details?.avis;
};

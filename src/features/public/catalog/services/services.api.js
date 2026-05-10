import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Recupere toutes les services
export const getServices = async (filters = {}) => {
  const { data } = await client.get("/api/services", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details?.services ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Recupere un service specifique
export const getServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/services/${slug}`);
  return data?.details?.service;
};

// Recupere les avis d'un service specifique
export const getServiceAvis = async (slug, page = 1) => {
  const { data } = await client.get(`/api/services/${slug}/avis`, {
    params: { page },
  });
  return {
    items: data?.details?.avis ?? [],
    meta: data?.details?.meta ?? {},
  };
};

import { client } from "@/api/client";

// Recupere toutes les services
export const getServices = async () => {
  const { data } = await client.get("/api/services");
  return data?.details?.services;
};

// Recupere un service specifique
export const getServiceBySlug = async (slug) => {
  const { data } = await client.get(`/api/services/${slug}`);
  return data?.details?.service;
};

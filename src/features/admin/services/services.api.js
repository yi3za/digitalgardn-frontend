import { client } from "@/api/client";

// Liste des services
export const getAdminServices = async () => {
  const { data } = await client.get("/api/admin/services");
  return data?.details.services ?? [];
};

// Detail d'un service (quel que soit son statut)
export const getAdminService = async (slug) => {
  const { data } = await client.get(`/api/admin/services/${slug}`);
  return data?.details?.service ?? null;
};

// Avis d'un service (quel que soit son statut)
export const getAdminServiceAvis = async (slug) => {
  const { data } = await client.get(`/api/admin/services/${slug}/avis`);
  return data?.details?.avis ?? [];
};

// Modifier le statut d'un service (publier / rejeter)
export const updateAdminServiceStatus = async ({ serviceId, statut }) => {
  const { data } = await client.patch(
    `/api/admin/services/${serviceId}/status`,
    { statut },
  );
  return data?.details?.service ?? null;
};

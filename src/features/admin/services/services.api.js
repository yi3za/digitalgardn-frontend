import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste des services
export const getAdminServices = async (filters = {}) => {
  const { data } = await client.get("/api/admin/services", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details.services ?? [],
    meta: data?.details.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
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

import { client } from "@/api/client";

// Liste des services
export const getAdminServices = async () => {
  const { data } = await client.get("/api/admin/services");
  return data?.details.services ?? [];
};

// Modifier le statut d'un service (publier / rejeter)
export const updateAdminServiceStatus = async ({ serviceId, statut }) => {
  const { data } = await client.patch(
    `/api/admin/services/${serviceId}/status`,
    { statut },
  );
  return data?.details?.service ?? null;
};

import { client } from "@/api/client";

// Statistiques globales de la plateforme
export const getAdminStats = async () => {
  const { data } = await client.get("/api/admin/stats");
  return data?.details?.stats ?? null;
};

// Liste des utilisateurs
export const getAdminUsers = async () => {
  const { data } = await client.get("/api/admin/users");
  return data?.details.users ?? [];
};

// Modifier le statut d'un utilisateur
export const updateAdminUserStatus = async ({ userId, status }) => {
  const { data } = await client.patch(`/api/admin/users/${userId}/status`, {
    status,
  });
  return data?.details?.user ?? null;
};

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

// Liste des commandes
export const getAdminCommandes = async () => {
  const { data } = await client.get("/api/admin/commandes");
  return data?.details.commandes ?? [];
};

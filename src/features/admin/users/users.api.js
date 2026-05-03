import { client } from "@/api/client";

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

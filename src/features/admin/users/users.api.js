import { client } from "@/api/client";
import { cleanFilters } from "@/lib/utils";

// Liste des utilisateurs
export const getAdminUsers = async (filters = {}) => {
  const { data } = await client.get("/api/admin/users", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details.users ?? [],
    meta: data?.details?.meta ?? {},
  };
};

// Modifier le statut d'un utilisateur
export const updateAdminUserStatus = async ({ userId, status }) => {
  const { data } = await client.patch(`/api/admin/users/${userId}/status`, {
    status,
  });
  return data?.details?.user ?? null;
};

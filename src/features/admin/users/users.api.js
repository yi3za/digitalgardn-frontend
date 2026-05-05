import { client } from "@/api/client";

// Supprime les valeurs vides avant envoi a l'API
const cleanFilters = (f) =>
  Object.fromEntries(
    Object.entries(f ?? {}).filter(([, v]) => v !== "" && v != null),
  );

// Liste des utilisateurs
export const getAdminUsers = async (filters = {}) => {
  const { data } = await client.get("/api/admin/users", {
    params: cleanFilters(filters),
  });
  return {
    items: data?.details.users ?? [],
    meta: data?.details.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

// Modifier le statut d'un utilisateur
export const updateAdminUserStatus = async ({ userId, status }) => {
  const { data } = await client.patch(`/api/admin/users/${userId}/status`, {
    status,
  });
  return data?.details?.user ?? null;
};

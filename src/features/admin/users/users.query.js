import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUserStatus } from "./users.api";

// Liste des utilisateurs
export const useAdminUsers = (filters = {}) =>
  useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => getAdminUsers(filters),
  });

// Mutation : modifier le statut d'un utilisateur
export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

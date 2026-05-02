import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminUsers,
  getAdminServices,
  getAdminCommandes,
  updateAdminUserStatus,
  updateAdminServiceStatus,
} from "./admin.api";

// Statistiques globales
export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

// Liste des utilisateurs
export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
  });

// Liste des services
export const useAdminServices = () =>
  useQuery({
    queryKey: ["admin", "services"],
    queryFn: getAdminServices,
  });

// Liste des commandes
export const useAdminCommandes = () =>
  useQuery({
    queryKey: ["admin", "commandes"],
    queryFn: getAdminCommandes,
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

// Mutation : modifier le statut d'un service
export const useUpdateAdminServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

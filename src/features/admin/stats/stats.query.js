import { useQuery } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminActivite,
  getAdminTendances,
} from "./stats.api";

// Statistiques globales
export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

// Activite recente : services en attente + derniers inscrits + dernieres commandes
export const useAdminActivite = () =>
  useQuery({
    queryKey: ["admin", "activite"],
    queryFn: getAdminActivite,
  });

// Tendances mensuelles : inscriptions et commandes
export const useAdminTendances = () =>
  useQuery({
    queryKey: ["admin", "tendances"],
    queryFn: getAdminTendances,
  });

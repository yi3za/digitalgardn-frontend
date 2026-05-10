import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getDashboardCommandesRecentes,
  getDashboardAvisRecentes,
  getDashboardRevenuesMensuels,
} from "./dashboard.api";

// Hook pour recuperer les statistiques globales du dashboard
export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// Hook pour recuperer les commandes recentes
export const useDashboardCommandesRecentes = () =>
  useQuery({
    queryKey: ["dashboard", "commandes-recentes"],
    queryFn: getDashboardCommandesRecentes,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

// Hook pour recuperer les avis recents
export const useDashboardAvisRecentes = () =>
  useQuery({
    queryKey: ["dashboard", "avis-recentes"],
    queryFn: getDashboardAvisRecentes,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

// Hook pour recuperer les revenus mensuels
export const useDashboardRevenuesMensuels = () =>
  useQuery({
    queryKey: ["dashboard", "revenus-mensuels"],
    queryFn: getDashboardRevenuesMensuels,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

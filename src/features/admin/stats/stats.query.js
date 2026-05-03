import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "./stats.api";

// Statistiques globales
export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

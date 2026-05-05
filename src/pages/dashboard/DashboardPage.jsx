import { useTranslation } from "react-i18next";
import { DashboardStatsSection } from "@/components/dashboard/DashboardStatsSection";
import { DashboardRevenueChart } from "@/components/dashboard/DashboardRevenueChart";
import { DashboardCommandesChart } from "@/components/dashboard/DashboardCommandesChart";
import { DashboardRecentCommandes } from "@/components/dashboard/DashboardRecentCommandes";
import {
  useDashboardStats,
  useDashboardCommandesRecentes,
  useDashboardRevenuesMensuels,
} from "@/features/account/dashboard/dashboard.query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

/**
 * Page principal du tableau de bord freelance
 * Affiche les statistiques et metriques en temps reel
 */
export function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common", "codes", "commandes"]);
  // Requetes API
  const statsQuery = useDashboardStats();
  const commandesQuery = useDashboardCommandesRecentes();
  const revenusQuery = useDashboardRevenuesMensuels();
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>{t("dashboard:title")}</CardTitle>
        <CardDescription>{t("dashboard:description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <DashboardStatsSection
          t={t}
          stats={statsQuery.data}
          isLoading={statsQuery.isLoading}
          isError={statsQuery.isError}
          error={statsQuery.error}
          refetch={statsQuery.refetch}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardRevenueChart
            t={t}
            data={revenusQuery.data ?? []}
            isLoading={revenusQuery.isLoading}
            isError={revenusQuery.isError}
            error={revenusQuery.error}
            refetch={revenusQuery.refetch}
          />
          <DashboardCommandesChart
            t={t}
            stats={statsQuery.data}
            isLoading={statsQuery.isLoading}
            isError={statsQuery.isError}
            error={statsQuery.error}
            refetch={statsQuery.refetch}
          />
        </div>
        <DashboardRecentCommandes
          t={t}
          commandes={commandesQuery.data ?? []}
          isLoading={commandesQuery.isLoading}
          isError={commandesQuery.isError}
          error={commandesQuery.error}
          refetch={commandesQuery.refetch}
        />
      </CardContent>
    </Card>
  );
}

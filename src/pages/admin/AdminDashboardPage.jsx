import { useTranslation } from "react-i18next";
import {
  useAdminStats,
  useAdminActivite,
  useAdminTendances,
} from "@/features/admin/stats/stats.query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { AdminStatsSection } from "@/components/admin/AdminStatsSection";
import { AdminRecentServicesList } from "@/components/admin/AdminRecentServicesList";
import { AdminRecentUsersList } from "@/components/admin/AdminRecentUsersList";
import { AdminRecentCommandesList } from "@/components/admin/AdminRecentCommandesList";
import { AdminUsersGrowthChart } from "@/components/admin/AdminUsersGrowthChart";
import { DashboardCommandesChart } from "@/components/dashboard/DashboardCommandesChart";

/**
 * Page tableau de bord de l'espace admin
 * Structure identique au dashboard freelance : stats → graphiques → activite recente
 */
export function AdminDashboardPage() {
  // Recuperer les traductions et les queries
  const { t } = useTranslation([
    "admin",
    "codes",
    "common",
    "commandes",
    "dashboard",
  ]);
  // Queries pour les statistiques globales, l'activite recente et les tendances mensuelles
  const statsQuery = useAdminStats();
  const activiteQuery = useAdminActivite();
  const tendancesQuery = useAdminTendances();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:dashboard.title")}</CardTitle>
        <CardDescription>{t("admin:dashboard.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <AdminStatsSection
          t={t}
          stats={statsQuery.data}
          isLoading={statsQuery.isLoading}
          isError={statsQuery.isError}
          error={statsQuery.error}
          refetch={statsQuery.refetch}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminUsersGrowthChart
            t={t}
            data={tendancesQuery.data?.inscriptions_mensuelles ?? []}
            isLoading={tendancesQuery.isLoading}
            isError={tendancesQuery.isError}
            error={tendancesQuery.error}
            refetch={tendancesQuery.refetch}
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminRecentServicesList
            t={t}
            services={activiteQuery.data?.services ?? []}
            isLoading={activiteQuery.isLoading}
            isError={activiteQuery.isError}
            isFetching={activiteQuery.isFetching}
            error={activiteQuery.error}
            refetch={activiteQuery.refetch}
          />
          <AdminRecentUsersList
            t={t}
            users={activiteQuery.data?.users ?? []}
            isLoading={activiteQuery.isLoading}
            isError={activiteQuery.isError}
            isFetching={activiteQuery.isFetching}
            error={activiteQuery.error}
            refetch={activiteQuery.refetch}
          />
        </div>
        <AdminRecentCommandesList
          t={t}
          commandes={activiteQuery.data?.commandes ?? []}
          isLoading={activiteQuery.isLoading}
          isError={activiteQuery.isError}
          isFetching={activiteQuery.isFetching}
          error={activiteQuery.error}
          refetch={activiteQuery.refetch}
        />
      </CardContent>
    </Card>
  );
}

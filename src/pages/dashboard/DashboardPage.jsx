import { useTranslation } from "react-i18next";
import { DashboardStatsSection } from "@/components/dashboard/DashboardStatsSection";
import { DashboardRevenueChart } from "@/components/dashboard/DashboardRevenueChart";
import { DashboardCommandesChart } from "@/components/dashboard/DashboardCommandesChart";
import { DashboardRecentCommandes } from "@/components/dashboard/DashboardRecentCommandes";
import { DashboardRecentAvis } from "@/components/dashboard/DashboardRecentAvis";
import {
  useDashboardStats,
  useDashboardCommandesRecentes,
  useDashboardAvisRecentes,
  useDashboardRevenuesMensuels,
} from "@/features/account/dashboard/dashboard.query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  Button,
  Spinner,
} from "@/components/ui";
import { RefreshCw } from "lucide-react";

/**
 * Page principal du tableau de bord freelance
 * Affiche les statistiques et metriques en temps reel
 */
export function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common", "codes", "commandes"]);
  // Requetes API
  const statsQuery = useDashboardStats();
  // Requetes pour les commandes recentes, les avis recents et les revenus mensuels
  const commandesQuery = useDashboardCommandesRecentes();
  const avisQuery = useDashboardAvisRecentes();
  const revenusQuery = useDashboardRevenuesMensuels();
  // Indicateur de chargement global pour le dashboard
  const isFetching =
    statsQuery.isFetching ||
    commandesQuery.isFetching ||
    avisQuery.isFetching ||
    revenusQuery.isFetching;
  // Fonction de rafraichissement de toutes les donnees du dashboard
  const onRefetch = () => {
    statsQuery.refetch();
    commandesQuery.refetch();
    avisQuery.refetch();
    revenusQuery.refetch();
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>
          {t("dashboard:title")}
          {isFetching && <Spinner className="inline mx-3" />}
        </CardTitle>
        <CardDescription>{t("dashboard:description")}</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost" onClick={onRefetch}>
            <RefreshCw className="size-4" />
          </Button>
        </CardAction>
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardRecentCommandes
            t={t}
            commandes={commandesQuery.data ?? []}
            isLoading={commandesQuery.isLoading}
            isError={commandesQuery.isError}
            error={commandesQuery.error}
            refetch={commandesQuery.refetch}
          />
          <DashboardRecentAvis
            t={t}
            avis={avisQuery.data ?? []}
            isLoading={avisQuery.isLoading}
            isError={avisQuery.isError}
            error={avisQuery.error}
            refetch={avisQuery.refetch}
          />
        </div>
      </CardContent>
    </Card>
  );
}

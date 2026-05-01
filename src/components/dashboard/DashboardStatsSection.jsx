import { DashboardStatCard } from "./DashboardStatCard";
import { ShoppingCart, Star, Layers, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DataError } from "@/components/ui";
import { CURRENCY } from "@/lib/config";

/**
 * Section des 4 cartes de statistiques du dashboard
 */
export function DashboardStatsSection({
  t,
  stats,
  isLoading = false,
  isError = false,
  error,
  refetch,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  const STAT_CARDS = [
    {
      key: "revenus",
      title: t("dashboard:stats.revenue"),
      value: formatPrice(stats?.portefeuille?.revenus_mois) + " " + CURRENCY,
      description: t("dashboard:stats.revenueDesc"),
      icon: Wallet,
    },
    {
      key: "commandes",
      title: t("dashboard:stats.orders"),
      value: stats?.commandes?.total,
      description: t("dashboard:stats.ordersDesc", {
        en_cours: stats?.commandes?.en_cours ?? 0,
      }),
      icon: ShoppingCart,
    },
    {
      key: "services",
      title: t("dashboard:stats.services"),
      value: stats?.services?.publies,
      description: t("dashboard:stats.servicesDesc", {
        total: stats?.services?.total ?? 0,
      }),
      icon: Layers,
    },
    {
      key: "avis",
      title: t("dashboard:stats.rating"),
      value: stats?.avis?.note_moyenne ? `${stats.avis.note_moyenne} / 5` : "—",
      description: t("dashboard:stats.ratingDesc", {
        count: stats?.avis?.total ?? 0,
      }),
      icon: Star,
    },
  ];

  if (isError) {
    return (
      <DataError
        errorCode={code}
        onRetry={refetch}
        retryText={t("common:actions.retry")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map(({ key, title, value, description, icon }) => (
        <DashboardStatCard
          key={key}
          title={title}
          value={value}
          description={description}
          icon={icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

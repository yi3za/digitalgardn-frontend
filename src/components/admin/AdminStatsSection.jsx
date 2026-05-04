import { Users, ShieldBan, Layers, ShoppingCart, Star } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DataError } from "@/components/ui";

// Configuration des 5 cartes statistiques admin
const buildStatCards = (t, stats) => [
  {
    key: "utilisateurs",
    title: t("admin:dashboard.stats.total_users"),
    value: stats?.utilisateurs?.total,
    description: t("admin:dashboard.stats.total_users_desc", {
      clients: stats?.utilisateurs?.clients ?? 0,
      freelances: stats?.utilisateurs?.freelances ?? 0,
    }),
    icon: Users,
  },
  {
    key: "bannis",
    title: t("admin:dashboard.stats.banned"),
    value: stats?.utilisateurs?.bannis,
    description: t("admin:dashboard.stats.banned_desc"),
    icon: ShieldBan,
  },
  {
    key: "services",
    title: t("admin:dashboard.stats.services"),
    value: stats?.services?.total,
    description: t("admin:dashboard.stats.services_desc", {
      publies: stats?.services?.publies ?? 0,
      en_attente: stats?.services?.en_attente ?? 0,
    }),
    icon: Layers,
  },
  {
    key: "commandes",
    title: t("admin:dashboard.stats.commandes"),
    value: stats?.commandes?.total,
    description: t("admin:dashboard.stats.commandes_desc", {
      en_cours: stats?.commandes?.en_cours ?? 0,
      terminees: stats?.commandes?.terminees ?? 0,
    }),
    icon: ShoppingCart,
  },
  {
    key: "avis",
    title: t("admin:dashboard.stats.avis"),
    value: stats?.avis?.total,
    description: t("admin:dashboard.stats.avis_desc", {
      note_moyenne: stats?.avis?.note_moyenne ?? "—",
    }),
    icon: Star,
  },
];

/**
 * Section des cartes de statistiques du dashboard admin
 */
export function AdminStatsSection({
  t,
  stats,
  isLoading = false,
  isError = false,
  error,
  refetch,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  const cards = buildStatCards(t, stats);

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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {cards.map(({ key, title, value, description, icon }) => (
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

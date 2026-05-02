import { useTranslation } from "react-i18next";
import { useAdminStats } from "@/features/admin/admin.query";
import { Users, Layers, ShoppingCart, ShieldOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataError,
} from "@/components/ui";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";

/**
 * Constante de configuration des cartes de stats admin
 */
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
    icon: ShieldOff,
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
];

/**
 * Page tableau de bord de l'espace admin
 */
export function AdminDashboardPage() {
  // Recuperer la fonction de traduction et les statistiques admin
  const { t } = useTranslation(["admin", "codes", "common"]);
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:dashboard.title")}</CardTitle>
        <CardDescription>{t("admin:dashboard.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {buildStatCards(t, stats).map(
              ({ key, title, value, description, icon }) => (
                <DashboardStatCard
                  key={key}
                  title={title}
                  value={value ?? "—"}
                  description={description}
                  icon={icon}
                  isLoading={isLoading}
                />
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

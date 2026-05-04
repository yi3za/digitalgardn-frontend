import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { DataLoading, DataError } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

/**
 * Graphique de repartition des commandes par statut (tous les statuts)
 */
export function DashboardCommandesChart({
  stats,
  isLoading,
  isError,
  error,
  refetch,
  t,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  const data = [
    {
      label: t("commandes:status.en_attente"),
      count: stats?.commandes?.en_attente ?? 0,
      color: "#f59e0b",
    },
    {
      label: t("commandes:status.en_cours"),
      count: stats?.commandes?.en_cours ?? 0,
      color: "#3b82f6",
    },
    {
      label: t("commandes:status.livree"),
      count: stats?.commandes?.livrees ?? 0,
      color: "#8b5cf6",
    },
    {
      label: t("commandes:status.en_revision"),
      count: stats?.commandes?.en_revision ?? 0,
      color: "#f97316",
    },
    {
      label: t("commandes:status.terminee"),
      count: stats?.commandes?.terminees ?? 0,
      color: "#10b981",
    },
    {
      label: t("commandes:status.annulee"),
      count: stats?.commandes?.annulees ?? 0,
      color: "#ef4444",
    },
  ];

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("dashboard:charts.orders.title")}</CardTitle>
        <CardDescription>
          {t("dashboard:charts.orders.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 32, bottom: 4, left: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value) => [
                  value,
                  t("dashboard:charts.orders.count"),
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

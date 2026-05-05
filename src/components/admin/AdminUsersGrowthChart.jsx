import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
} from "@/components/ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMoisLabel } from "@/lib/utils";

/**
 * Graphique de la croissance des inscriptions mensuelles (6 derniers mois)
 * Les labels de mois sont formates selon la locale active de l'utilisateur
 */
export function AdminUsersGrowthChart({
  data = [],
  isLoading,
  isError,
  error,
  refetch,
  t,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Formateur de labels pour les mois (ex: "2024-01" → "Jan 24")
  const tickFormatter = (value) => formatMoisLabel(value);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("admin:dashboard.charts.growth.title")}</CardTitle>
        <CardDescription>
          {t("admin:dashboard.charts.growth.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1">
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && data.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && data.length > 0 && (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="mois"
                tickFormatter={tickFormatter}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={35}
              />
              <Tooltip
                labelFormatter={tickFormatter}
                formatter={(value) => [
                  value,
                  t("admin:dashboard.charts.growth.users"),
                ]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="url(#growthGradient)"
                dot={{ fill: "var(--primary)", r: 4, strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

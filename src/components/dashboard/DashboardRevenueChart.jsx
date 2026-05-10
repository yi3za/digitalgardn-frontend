import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { DataLoading, DataError, DataEmpty } from "@/components/ui";
import { CURRENCY } from "@/lib/config";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

/**
 * Graphique de revenus mensuels du freelance
 */
export function DashboardRevenueChart({
  data = [],
  isLoading,
  isError,
  error,
  refetch,
  t,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{t("dashboard:charts.revenue.title")}</CardTitle>
        <CardDescription>
          {t("dashboard:charts.revenue.description")}
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
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatPrice(v)}
                width={60}
              />
              <Tooltip
                formatter={(value) => [
                  formatPrice(value) + " " + CURRENCY,
                  t("dashboard:charts.revenue.amount"),
                ]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "var(--card-foreground)" }}
                itemStyle={{ color: "var(--muted-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="url(#revenueGradient)"
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

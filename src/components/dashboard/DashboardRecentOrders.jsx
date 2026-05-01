import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui";
import {
  DataLoading,
  DataError,
  DataEmpty,
  ItemGroup,
  Button,
  ScrollArea,
} from "@/components/ui";
import { CommandeItem } from "@/components/commandes/CommandeItem";
import { Link } from "react-router-dom";

/**
 * Liste des commandes recentes du freelance (donnees reelles API)
 */
export function DashboardRecentOrders({
  commandes = [],
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
        <CardTitle>{t("dashboard:activity.title")}</CardTitle>
        <CardDescription>{t("dashboard:activity.description")}</CardDescription>
        <CardAction>
          <Button variant="link" size="sm" asChild>
            <Link to="/dashboard/commandes">{t("common:actions.viewAll")}</Link>
          </Button>
        </CardAction>
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
        {!isLoading && !isError && commandes.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && commandes.length > 0 && (
          <ScrollArea className="h-100">
            <ItemGroup className="gap-3">
              {commandes.map((commande) => (
                <CommandeItem
                  key={commande.id}
                  item={commande}
                  linkTo={`/dashboard/messages`}
                  t={t}
                />
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

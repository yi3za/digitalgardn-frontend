import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
  ItemGroup,
  Button,
  ScrollArea,
  Spinner,
} from "@/components/ui";
import { CommandeItem } from "@/components/commandes/CommandeItem";

/**
 * Liste des dernieres commandes recentes de la plateforme (dashboard admin)
 */
export function AdminRecentCommandesList({
  t,
  commandes = [],
  isLoading,
  isError,
  isFetching,
  error,
  refetch,
}) {
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {t("admin:dashboard.activite.commandes.title")}
          {isFetching && <Spinner className="inline ml-2" />}
        </CardTitle>
        <CardDescription>
          {t("admin:dashboard.activite.commandes.description")}
        </CardDescription>
        <CardAction>
          <Button variant="link" size="sm" asChild>
            <Link to="/admin/commandes">
              {t("admin:dashboard.activite.commandes.viewAll")}
            </Link>
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
          <DataEmpty
            description={t("admin:dashboard.activite.commandes.empty")}
          />
        )}
        {!isLoading && !isError && commandes.length > 0 && (
          <ScrollArea className="h-80">
            <ItemGroup className="gap-3">
              {commandes.map((commande) => (
                <CommandeItem
                  key={commande.id}
                  item={commande}
                  linkTo="/admin/commandes"
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
